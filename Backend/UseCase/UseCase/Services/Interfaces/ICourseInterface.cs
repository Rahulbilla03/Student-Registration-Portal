using UseCase.Model;

namespace UseCase.Services.Interfaces
{
    public interface ICourseInterface
    {
        Task<List<object>> GetCourseById(int id);

        Task<object> CreateCourse(Course course);

        Task AddTopic(int courseId, string topicName);

        Task<List<object>> GetTopics(int courseId);

        Task UpdateCourse(int courseId, Course updatedCourse);
    }
}
