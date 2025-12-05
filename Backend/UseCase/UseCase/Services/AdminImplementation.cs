using Microsoft.EntityFrameworkCore;
using UseCase.Data;
using UseCase.Model;
using UseCase.Services.Interfaces;

namespace UseCase.Services.Implementations
{
    public class AdminImplementation : IAdminInterface
    {
        private readonly AppDbContext _context;

        public AdminImplementation(AppDbContext context)
        {
            _context = context;
        }

        public async Task RegisterStudent(Student student)
        {
            if (await _context.Students.AnyAsync(x =>
                x.UserName.ToLower() == student.UserName.ToLower()))
                throw new Exception("Username already exists");

            if (await _context.Students.AnyAsync(x =>
                x.EmailId.ToLower() == student.EmailId.ToLower()))
                throw new Exception("Email already exists");

            _context.Students.Add(student);
            await _context.SaveChangesAsync();
        }

        public async Task<List<object>> GetAllCourses()
        {
            return await _context.Courses
                .Include(x => x.Enrollments)
                .Select(c => new
                {
                    c.CourseId,
                    c.CourseName,
                    c.CourseCapacity,
                    RemainingSeats = c.CourseCapacity - c.Enrollments.Count
                })
                .Cast<object>()
                .ToListAsync();
        }

        public async Task<List<object>> GetAllStudents()
        {
            return await _context.Students.Include(s => s.Enrollments)
                .Select(s => new
                {
                    s.StudentId,
                    s.UserName,
                    s.EmailId,
                    s.Password,
                    s.Address,
                    s.Phone,
                    EnrolledCourses = s.Enrollments.Count()
                })
                .Cast<object>()
                .ToListAsync();
        }

        public async Task<List<object>> GetAllEnrollments()
        {
            return await _context.Enrollments
                .Include(e => e.Student)
                .Include(e => e.Course)
                .Select(e => new
                {
                    StudentId = e.StudentId,
                    StudentName = e.Student.UserName,
                    CourseName = e.Course.CourseName,
                    CourseCapacity = e.Course.CourseCapacity
                })
                .Cast<object>()
                .ToListAsync();
        }

        public async Task<object> GetEnrollmentsForCourse(int courseId)
        {
            var course = await _context.Courses.FindAsync(courseId)
                ?? throw new Exception("Course not found");

            var enrollments = await _context.Enrollments
                .Include(e => e.Student)
                .Where(e => e.CourseId == courseId)
                .Select(e => new
                {
                    e.Student.StudentId,
                    e.Student.UserName
                })
                .ToListAsync();

            return new
            {
                course.CourseName,
                TotalEnrolled = enrollments.Count,
                Students = enrollments
            };
        }

        public async Task DeleteCourse(int courseId)
        {
            var course = await _context.Courses.FindAsync(courseId)
                ?? throw new Exception("Course not found");

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateStudent(int studentId, Student updatedStudent)
        {
            var student = await _context.Students
                .FirstOrDefaultAsync(x => x.StudentId == studentId)
                ?? throw new Exception("Student not found");

            bool exists = await _context.Students.AnyAsync(s =>
                s.StudentId != studentId &&
                (s.UserName.ToLower() == updatedStudent.UserName.ToLower() ||
                 s.EmailId.ToLower() == updatedStudent.EmailId.ToLower()));

            if (exists)
                throw new Exception("Student already exists");

            student.UserName = updatedStudent.UserName;
            student.EmailId = updatedStudent.EmailId;
            student.Address = updatedStudent.Address;
            student.Phone = updatedStudent.Phone;
            student.Password = updatedStudent.Password;

            await _context.SaveChangesAsync();
        }

        public async Task DeleteStudent(int studentId)
        {
            var student = await _context.Students
                .Include(s => s.Enrollments)
                .FirstOrDefaultAsync(s => s.StudentId == studentId)
                ?? throw new Exception("Student not found");

            _context.Enrollments.RemoveRange(student.Enrollments);
            _context.Students.Remove(student);

            await _context.SaveChangesAsync();
        }

        public async Task<Student> GetByUsername(string username)
        {
            return await _context.Students
                .FirstOrDefaultAsync(s => s.UserName == username)
                ?? throw new Exception("Student not found");
        }

        public async Task<List<object>> GetCourseProgress(int courseId)
        {
            int totalTopics = await _context.Topics
                .CountAsync(t => t.CourseId == courseId);

            var result = await _context.Enrollments
                .Include(e => e.Student)
                .Where(e => e.CourseId == courseId)
                .Select(e => new
                {
                    StudentId = e.Student.StudentId,
                    StudentName = e.Student.UserName,
                    CompletedTopics = _context.TopicProgresses
                        .Count(tp =>
                            tp.StudentId == e.Student.StudentId &&
                            tp.Topic.CourseId == courseId),
                    TotalTopics = totalTopics
                })
                .ToListAsync();

            return result.Select(x => new
            {
                x.StudentId,
                x.StudentName,
                x.CompletedTopics,
                x.TotalTopics,
                Progress = x.TotalTopics == 0
                    ? 0
                    : Math.Round((double)x.CompletedTopics / x.TotalTopics * 100, 2)
            }).Cast<object>().ToList();
        }
    }
}
