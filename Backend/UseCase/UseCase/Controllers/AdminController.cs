using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;
        public AdminController(AppDbContext context)
        {
            _context = context;
                
        }

        [HttpPost("register")] //to register student
        public async Task<ActionResult> Register([FromBody] Student student)
        {
            if (student == null)
                return BadRequest("Invalid request");

            if (string.IsNullOrWhiteSpace(student.UserName))
                return BadRequest("Username is required");

            if (string.IsNullOrWhiteSpace(student.EmailId))
                return BadRequest("Email is required");
          
            var usernameExists = await _context.Students
                .AnyAsync(s => s.UserName.ToLower() == student.UserName.ToLower());

            if (usernameExists)
                return BadRequest($"Username '{student.UserName}' already exists");

            var emailExists = await _context.Students
                .AnyAsync(s => s.EmailId.ToLower() == student.EmailId.ToLower());

            if (emailExists)
                return BadRequest("Email already registered");

            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            return Ok("Student registered successfully");
        }


        [AllowAnonymous]
        [HttpGet("all-courses")] //to get all courses 
        public async Task<ActionResult> GetAllCourses()
        {
            var courses = await _context.Courses
                .Include(c => c.Enrollments)
                .ToListAsync();
            if (courses.Count == 0)
                return Ok("No courses available right now.");
            var result = courses.Select(c => new
            {
                c.CourseId,
                c.CourseName,
                c.CourseCapacity,
                RemainingSeats = c.CourseCapacity - c.Enrollments.Count

            });
            return Ok(result);
        }

        [AllowAnonymous]
        [HttpGet("all-students")] //to get all students
        public async Task<ActionResult> GetAllStudents()
        {
            var students = await _context.Students.Include(s => s.Enrollments)
                .Select(s => new { s.StudentId, s.UserName, s.EmailId,s.Password,s.Address,s.Phone, EnrolledCourses=s.Enrollments.Count() 
                }).ToListAsync();
            return Ok(students);
        }

        [AllowAnonymous]
        [HttpGet("getallenrollments")] //to get all enrollments
        public async Task<ActionResult> GetAllEnrollments()
        {
            var enrollments = await _context.Enrollments
                .Include(e => e.Student)
                .Include(e => e.Course)
                .ToListAsync();

            if (enrollments.Count == 0)
                return Ok("No enrollments found yet");

            var result = enrollments.Select(e => new
            {
                StudentId=e.StudentId,
                StudentName = e.Student != null ? e.Student.UserName : "Unknown",
                CourseName = e.Course != null ? e.Course.CourseName : "Unknown",
                CourseCapacity = e.Course?.CourseCapacity ?? 0
            });
            return Ok(result);
        }

        [HttpGet("course-enrollments/{courseId}")]  //to get enrollments for a particular course
        public async Task<ActionResult> GetEnrollmentsForCourse(int courseId)
        {
            if (courseId <= 0)
                return BadRequest("Valid Course ID is required.");

            var course = await _context.Courses
                .FirstOrDefaultAsync(c => c.CourseId == courseId); 
            if (course == null)
                return NotFound("Course not found.");
            var enrollments = await _context.Enrollments
                .Include(e => e.Student)
                .Where(e => e.CourseId == course.CourseId).ToListAsync();
            if (!enrollments.Any())
                return Ok($"No students enrolled in '{course.CourseName}' yet.");

            var students = enrollments.Select(e => new
            {
                e.Student.StudentId,
                e.Student.UserName
            });

            return Ok(new
            {
                course.CourseName,
                TotalEnrolled = enrollments.Count,
                Students = students
            });
        }

        [HttpDelete("delete-course/{courseId}")] //delete course by course id
        public async Task<IActionResult> DeleteCourse(int courseId)
        {
            var course = await _context.Courses.FirstOrDefaultAsync(c => c.CourseId == courseId);
            if (course == null)
                return NotFound("Course not found.");

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();

            return Ok($"Course '{course.CourseName}' deleted successfully.");
        }

        [HttpPut("update/student/{studentId}")] //updating student 
        public async Task<ActionResult> UpdateStudent(int studentId, [FromBody] Student updatedStudent)
        {
            var student = await _context.Students
                .FirstOrDefaultAsync(s => s.StudentId == studentId);

            if (student == null)
                return NotFound("Student not found.");

            var duplicate = await _context.Students.AnyAsync(s =>
                s.StudentId != studentId &&
                (
                    s.EmailId.ToLower() == updatedStudent.EmailId.ToLower()
                    || s.UserName.ToLower() == updatedStudent.UserName.ToLower()
                )
            );

            if (duplicate)
                return BadRequest("Student already exists.");

            student.EmailId = updatedStudent.EmailId;
            student.Phone = updatedStudent.Phone;
            student.Address = updatedStudent.Address;
            student.UserName = updatedStudent.UserName;
            student.Password = updatedStudent.Password;

            await _context.SaveChangesAsync();

            return Ok("Student details updated successfully.");
        }

        [HttpDelete("delete/student/{studentId}")] //delete student by id

        public async Task<IActionResult> DeleteStudent(int studentId)
        {
            var student = await _context.Students
                .Include(s => s.Enrollments)
                .FirstOrDefaultAsync(s => s.StudentId == studentId);

            if (student == null)
                return NotFound("Student not found.");

            if (student.Enrollments != null && student.Enrollments.Any())
                _context.Enrollments.RemoveRange(student.Enrollments);

            _context.Students.Remove(student);

            await _context.SaveChangesAsync();

            return Ok($"Student '{student.UserName}' deleted successfully.");
        }

        [HttpGet]
        [Route("ByUsername/{username}")] // to get student username 
        [AllowAnonymous]

        public async Task<ActionResult> GetAllDeatils(string username)
        {
            if (string.IsNullOrEmpty(username))
            {
                return NotFound("The UserName is Found");

            }

            var details = await _context.Students
                .FirstOrDefaultAsync(n => n.UserName == username);

            if (details == null)
                return NotFound("No student found");

            return Ok(details);


        }
        [HttpGet("course-progress/{courseId}")] //to see the progress of a particular course
        public async Task<IActionResult> CourseProgress(int courseId)
        {
            var totalTopics = await _context.Topics
                .CountAsync(t => t.CourseId == courseId);

            var result = await _context.Enrollments
                .Include(e => e.Student)
                .Where(e => e.CourseId == courseId)
                .Select(e => new
                {
                    StudentId = e.Student.StudentId,
                    StudentName = e.Student.UserName,
                    CompletedTopics =
                        _context.TopicProgresses
                            .Count(tp =>
                                tp.StudentId == e.Student.StudentId &&
                                tp.Topic.CourseId == courseId),
                    TotalTopics = totalTopics
                })
                .ToListAsync();

            var final = result.Select(x => new
            {
                x.StudentId,
                x.StudentName,
                x.CompletedTopics,
                x.TotalTopics,
                Progress =
                    x.TotalTopics == 0 ? 0 :
                    Math.Round((double)x.CompletedTopics / x.TotalTopics * 100, 2)
            });

            return Ok(final);
        }
    }

    public class AdminLogin()
    {
        [Required]
        public string UserName { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
