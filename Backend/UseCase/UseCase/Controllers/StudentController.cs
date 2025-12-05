using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using UseCase.Data;
using UseCase.Model;

namespace UseCase.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        private readonly AppDbContext _context;
        public StudentController(AppDbContext context)
        {
            _context = context;
        }

        

        [HttpPost("enroll")] //enrolling the student in a course
        public async Task<IActionResult> EnrollInCourse([FromBody] EnrollRequest request)
        {
            var student = await _context.Students.FindAsync(request.StudentId);
            if (student == null)
                return NotFound("Student not found.");

            var course = await _context.Courses.FindAsync(request.CourseId);
            if (course == null)
                return NotFound("Course not found.");

            bool alreadyEnrolled = await _context.Enrollments
                .AnyAsync(e => e.StudentId == request.StudentId && e.CourseId == request.CourseId);

            if (alreadyEnrolled)
                return BadRequest("Student is already enrolled in this course.");

            int enrolledCount = await _context.Enrollments
                .CountAsync(e => e.CourseId == course.CourseId);

            if (enrolledCount >= course.CourseCapacity)
                return BadRequest("Course is full. No seats available.");

            var enrollment = new Enrollment
            {
                StudentId = student.StudentId,
                CourseId = course.CourseId
            };

            _context.Enrollments.Add(enrollment);
            await _context.SaveChangesAsync();

            return Ok($"Student '{student.UserName}' successfully enrolled in '{course.CourseName}'.");
        }
  
        [HttpGet("my-enrollments/{studentId}")] //getting enrollments of a particular student
        public async Task<ActionResult> GetMyEnrollments(int studentId)
        {
        var student = await _context.Students.FindAsync(studentId);
        if (student == null)
            return NotFound("Student not found.");

        var courses = await _context.Enrollments
            .Include(e => e.Course)
            .Where(e => e.StudentId == studentId)
            .Select(e => new 
            {
                CourseId = e.Course.CourseId,
                CourseName = e.Course.CourseName
            })
            .ToListAsync();

        if (courses.Count == 0)
            return Ok($"{student.UserName} is not enrolled in any courses.");

        return Ok(new
        {
            StudentName = student.UserName,
            EnrolledCourses = courses
        });
        }


        [HttpDelete("unenroll/{studentId}/{courseId}")] //unenrolling a student from course by his id and course id
        public async Task<ActionResult> UnenrollFromCourse(int studentId, int courseId)
        {
            var student = await _context.Students.FindAsync(studentId);
            if (student == null)
                return NotFound("Student not found.");

            var course = await _context.Courses.FindAsync(courseId);
            if (course == null)
                return NotFound("Course not found.");

            var enrollment = await _context.Enrollments
                .FirstOrDefaultAsync(e => e.StudentId == studentId && e.CourseId == courseId);
            if (enrollment == null)
                return NotFound($"Student '{student.UserName}' is not enrolled in '{course.CourseName}'.");

            _context.Enrollments.Remove(enrollment);
            await _context.SaveChangesAsync();

            return Ok($"Student '{student.UserName}' successfully unenrolled from '{course.CourseName}'.");
        }

        [HttpPost("complete-topic")]
        public async Task<IActionResult> CompleteTopic(int studentId, int topicId) //marking topic completed by student
        {
            bool exists = await _context.TopicProgresses
                .AnyAsync(x => x.StudentId == studentId && x.TopicId == topicId);

            if (!exists)
            {
                _context.TopicProgresses.Add(new TopicProgress
                {
                    StudentId = studentId,
                    TopicId = topicId
                });

                await _context.SaveChangesAsync();
            }

            return Ok("Topic completed");
        }

        [HttpGet("progress/{studentId}/{courseId}")] //getting the progress of a student in a course
        public async Task<IActionResult> StudentProgress(int studentId, int courseId)
        {
            var totalTopics = await _context.Topics
                .CountAsync(t => t.CourseId == courseId);

            var completed = await _context.TopicProgresses
                .Include(tp => tp.Topic)
                .CountAsync(tp =>
                    tp.StudentId == studentId &&
                    tp.Topic.CourseId == courseId);

            var percent = totalTopics == 0 ? 0 :
                Math.Round((double)completed / totalTopics * 100, 2);

            return Ok(percent);
        }

        [HttpGet("topics/{studentId}/{courseId}")] //getting the topics completed by a student in a course
        public async Task<IActionResult> GetStudentTopics(int studentId, int courseId)
        {
            var topics = await _context.Topics
                .Where(t => t.CourseId == courseId)
                .Select(t => new
                {
                    t.TopicId,
                    t.TopicName
                })
                .ToListAsync();

            var completedTopics = await _context.TopicProgresses
                .Where(tp =>
                    tp.StudentId == studentId &&
                    tp.Topic.CourseId == courseId)
                .Select(tp => tp.TopicId)
                .ToListAsync();

            var total = topics.Count;
            var completed = completedTopics.Count;
            var progress = total == 0 ? 0 :
                Math.Round((double)completed / total * 100, 2);

            return Ok(new
            {
                AllTopics = topics,
                CompletedTopics = completedTopics,
                ProgressPercentage = progress
            });
        }

    public class EnrollRequest
        {
            [Required]
            public int StudentId { get; set; }

            [Required]
            public int CourseId { get; set; }
        }
    }
}
