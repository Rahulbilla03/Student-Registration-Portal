using Azure;
using Azure.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using UseCase.Data;
using UseCase.Model;

namespace UseCase.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CourseController : ControllerBase
    {
        private readonly AppDbContext _context;
        public CourseController(AppDbContext context)
        {
            _context = context;

        }

        [HttpGet("GetCourseById/{Id}")] //getting course by id
        public async Task<ActionResult> GetCourseById(int Id)
        {

            if (Id <= 0)
            {
                return BadRequest("The Id should Not be less than zero");
            }
            var courses = await _context.Courses.Where(n => n.CourseId == Id).Select(n => new
            {
                n.CourseId,
                n.CourseName,
                n.CourseCapacity,
            }).ToListAsync();


            if (courses.Count==0)
                return NotFound("Course not found.");

            return Ok(courses);

        }

        [HttpPost("CreateCourse")] //creating course
        public async Task<ActionResult> CreateCourse([FromBody] Course course)
        {
            if (course == null || string.IsNullOrWhiteSpace(course.CourseName))
                return BadRequest("Course name is required.");

            if (course.CourseCapacity <= 0)
                return BadRequest("Course capacity must be greater than 0.");

            var exists = await _context.Courses
                .AnyAsync(c => c.CourseName.ToLower() == course.CourseName.ToLower());

            if (exists)
                return BadRequest($"Course '{course.CourseName}' already exists.");

            _context.Courses.Add(course);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = $"Course '{course.CourseName}' created successfully",
                courseId = course.CourseId
            });
        }
        [HttpPost("add-topic")] //adding topics inside a course
        public async Task<IActionResult> AddTopic(int courseId, string topicName)
        {
            _context.Topics.Add(new Topic
            {
                CourseId = courseId,
                TopicName = topicName
            });

            await _context.SaveChangesAsync();
            return Ok("Topic added");
        }

        
        [HttpGet("{courseId}/topics")]  //getting topics in a course
        public async Task<IActionResult> GetTopics(int courseId)
        {
            var topics = await _context.Topics
                .Where(t => t.CourseId == courseId)
                .Select(t => new
                {
                    t.TopicId,
                    t.TopicName
                })
                .ToListAsync();

            return Ok(topics);
        }
   
        [HttpPut("update-course/{courseId}")] //updating the course by id 
        public async Task<IActionResult> UpdateCourse(int courseId, [FromBody] Course updatedCourse)
        {
            var course = await _context.Courses
                .FirstOrDefaultAsync(c => c.CourseId == courseId);

            if (course == null)
                return NotFound("Course not found.");

            var duplicate = await _context.Courses.AnyAsync(c =>
                c.CourseName.ToLower() == updatedCourse.CourseName.ToLower() &&
                c.CourseId != courseId
            );

            if (duplicate)
                return BadRequest("Course already exists.");

            course.CourseName = updatedCourse.CourseName;
            course.CourseCapacity = updatedCourse.CourseCapacity;

            await _context.SaveChangesAsync();

            return Ok("Course updated successfully.");
        }


    }
}


