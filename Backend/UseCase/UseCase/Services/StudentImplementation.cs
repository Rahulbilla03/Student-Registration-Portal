using Microsoft.EntityFrameworkCore;
using UseCase.Data;
using UseCase.Model;
using UseCase.Services.Interfaces;

namespace UseCase.Services.Implementations
{
    public class StudentImplementation : IStudentInterface
    {
        private readonly AppDbContext _context;

        public StudentImplementation(AppDbContext context)
        {
            _context = context;
        }

        public async Task<string> Enroll(int studentId, int courseId)
        {
            var student = await _context.Students.FindAsync(studentId)
                ?? throw new Exception("Student not found");

            var course = await _context.Courses.FindAsync(courseId)
                ?? throw new Exception("Course not found");

            if (await _context.Enrollments.AnyAsync(
                x => x.StudentId == studentId && x.CourseId == courseId))
                throw new Exception("Already enrolled");

            if (await _context.Enrollments.CountAsync(
                x => x.CourseId == courseId) >= course.CourseCapacity)
                throw new Exception("Course is full");

            _context.Enrollments.Add(new Enrollment
            {
                StudentId = studentId,
                CourseId = courseId
            });

            await _context.SaveChangesAsync();

            return $"Student '{student.UserName}' successfully enrolled in '{course.CourseName}'.";
        }

        public async Task<object> GetMyEnrollments(int studentId)
        {
            var student = await _context.Students.FindAsync(studentId)
                ?? throw new Exception("Student not found");

            var courses = await _context.Enrollments
                .Include(e => e.Course)
                .Where(e => e.StudentId == studentId)
                .Select(e => new
                {
                    e.Course.CourseId,
                    e.Course.CourseName
                })
                .ToListAsync();

            return new
            {
                StudentName = student.UserName,
                EnrolledCourses = courses
            };
        }

        public async Task<string> Unenroll(int studentId, int courseId)
        {
            var enroll = await _context.Enrollments
                .FirstOrDefaultAsync(e =>
                    e.StudentId == studentId &&
                    e.CourseId == courseId)
                ?? throw new Exception("Enrollment not found");

            _context.Enrollments.Remove(enroll);
            await _context.SaveChangesAsync();

            return "Unenrolled successfully";
        }

        public async Task CompleteTopic(int studentId, int topicId)
        {
            if (!await _context.TopicProgresses
                .AnyAsync(x => x.StudentId == studentId && x.TopicId == topicId))
            {
                _context.TopicProgresses.Add(new TopicProgress
                {
                    StudentId = studentId,
                    TopicId = topicId
                });

                await _context.SaveChangesAsync();
            }
        }

        public async Task<double> GetProgress(int studentId, int courseId)
        {
            int total = await _context.Topics
                .CountAsync(x => x.CourseId == courseId);

            int completed = await _context.TopicProgresses
                .CountAsync(x =>
                    x.StudentId == studentId &&
                    x.Topic.CourseId == courseId);

            return total == 0 ? 0 :
                Math.Round((double)completed / total * 100, 2);
        }

        public async Task<object> GetStudentTopics(
            int studentId,
            int courseId)
        {
            var topics = await _context.Topics
                .Where(t => t.CourseId == courseId)
                .Select(t => new
                {
                    t.TopicId,
                    t.TopicName
                })
                .ToListAsync();

            var completed = await _context.TopicProgresses
                .Where(tp =>
                    tp.StudentId == studentId &&
                    tp.Topic.CourseId == courseId)
                .Select(tp => tp.TopicId)
                .ToListAsync();

            double progress = topics.Count == 0 ? 0 :
                Math.Round((double)completed.Count / topics.Count * 100, 2);

            return new
            {
                AllTopics = topics,
                CompletedTopics = completed,
                ProgressPercentage = progress
            };
        }
    }
}
