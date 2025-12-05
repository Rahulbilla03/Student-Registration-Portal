using UseCase.Model;

namespace UseCase.Services.Interfaces
{
    public interface IAdminInterface
    {
        Task RegisterStudent(Student student);

        Task<List<object>> GetAllCourses();

        Task<List<object>> GetAllStudents();

        Task<List<object>> GetAllEnrollments();

        Task<object> GetEnrollmentsForCourse(int courseId);

        Task DeleteCourse(int courseId);

        Task UpdateStudent(int studentId, Student updatedStudent);

        Task DeleteStudent(int studentId);

        Task<Student> GetByUsername(string username);

        Task<List<object>> GetCourseProgress(int courseId);
    }
}
