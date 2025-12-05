using Microsoft.EntityFrameworkCore;
using UseCase.Data;
using UseCase.Model;
using UseCase.Services.Interfaces;

namespace UseCase.Services.Implementations
{
    public class CourseImplementation : ICourseInterface
    {
        private readonly AppDbContext _context;

        public CourseImplementation(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<object>> GetCourseById(int id)
            => await _context.Courses
                .Where(c => c.CourseId == id)
                .Select(c => new
                {
                    c.CourseId,
                    c.CourseName,
                    c.CourseCapacity
                })
                .Cast<object>()
                .ToListAsync();

        public async Task<object> CreateCourse(Course course)
        {
            if (await _context.Courses
                .AnyAsync(c =>
                    c.CourseName.ToLower() == course.CourseName.ToLower()))
                throw new Exception("Course already exists");

            _context.Courses.Add(course);
            await _context.SaveChangesAsync();

            return new
            {
                message = $"Course '{course.CourseName}' created successfully",
                courseId = course.CourseId
            };
        }

        public async Task AddTopic(int courseId, string topicName)
        {
            _context.Topics.Add(new Topic
            {
                CourseId = courseId,
                TopicName = topicName
            });

            await _context.SaveChangesAsync();
        }

        public async Task<List<object>> GetTopics(int courseId)
            => await _context.Topics
                .Where(t => t.CourseId == courseId)
                .Select(t => new
                {
                    t.TopicId,
                    t.TopicName
                })
                .Cast<object>()
                .ToListAsync();

        public async Task UpdateCourse(int courseId, Course updatedCourse)
        {
            var course = await _context.Courses
                .FirstOrDefaultAsync(c => c.CourseId == courseId)
                ?? throw new Exception("Course not found");

            var duplicate = await _context.Courses.AnyAsync(
                c => c.CourseName.ToLower() == updatedCourse.CourseName.ToLower()
                  && c.CourseId != courseId);

            if (duplicate)
                throw new Exception("Course already exists");

            course.CourseName = updatedCourse.CourseName;
            course.CourseCapacity = updatedCourse.CourseCapacity;

            await _context.SaveChangesAsync();
        }
    }
}
