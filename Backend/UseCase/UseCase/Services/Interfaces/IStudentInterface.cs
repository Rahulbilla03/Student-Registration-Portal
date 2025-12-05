namespace UseCase.Services.Interfaces
{
    public interface IStudentInterface
    {
        Task<string> Enroll(int studentId, int courseId);

        Task<object> GetMyEnrollments(int studentId);

        Task<string> Unenroll(int studentId, int courseId);

        Task CompleteTopic(int studentId, int topicId);

        Task<double> GetProgress(int studentId, int courseId);

        Task<object> GetStudentTopics(int studentId, int courseId);
    }
}
