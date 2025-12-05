using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UseCase.Controllers;
using UseCase.Data;
using UseCase.Model;
using Xunit;

namespace UseCase.Tests.Controllers
{
    public class StudentTests
    {
        private AppDbContext CreateContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            return new AppDbContext(options);
        }

        private async Task SeedStudent(AppDbContext context)
        {
            context.Students.Add(new Student
            {
                StudentId = 1,
                UserName = "rahul",
                EmailId = "rahul@gmail.com",
                Password = "password",
                Address = "Hyd",
                Phone = "1234567890",
                DOB = DateTime.Now
            });

            await context.SaveChangesAsync();
        }

        private async Task SeedCourse(AppDbContext context)
        {
            context.Courses.Add(new Course
            {
                CourseId = 1,
                CourseName = "C#",
                CourseCapacity = 10
            });

            await context.SaveChangesAsync();
        }

        private async Task SeedEnrollment(AppDbContext context)
        {
            context.Enrollments.Add(new Enrollment
            {
                StudentId = 1,
                CourseId = 1
            });

            await context.SaveChangesAsync();
        }

        private async Task SeedTopic(AppDbContext context)
        {
            context.Topics.Add(new Topic
            {
                TopicId = 1,
                TopicName = "Intro",
                CourseId = 1
            });

            await context.SaveChangesAsync();
        }

        private async Task SeedProgress(AppDbContext context)
        {
            context.TopicProgresses.Add(new TopicProgress
            {
                StudentId = 1,
                TopicId = 1
            });

            await context.SaveChangesAsync();
        }

        [Fact]
        public async Task Enroll_Returns_NotFound_When_Student_Missing()
        {
            var context = CreateContext();
            await SeedCourse(context);
            var controller = new StudentController(context);

            var result = await controller.EnrollInCourse(new StudentController.EnrollRequest
            {
                StudentId = 99,
                CourseId = 1
            });

            var notFound = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal("Student not found.", notFound.Value);
        }

        [Fact]
        public async Task Enroll_Returns_NotFound_When_Course_Missing()
        {
            var context = CreateContext();
            await SeedStudent(context);
            var controller = new StudentController(context);

            var result = await controller.EnrollInCourse(new StudentController.EnrollRequest
            {
                StudentId = 1,
                CourseId = 99
            });

            var notFound = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal("Course not found.", notFound.Value);
        }

        [Fact]
        public async Task Enroll_Returns_Ok_When_Success()
        {
            var context = CreateContext();
            await SeedStudent(context);
            await SeedCourse(context);
            var controller = new StudentController(context);

            var result = await controller.EnrollInCourse(new StudentController.EnrollRequest
            {
                StudentId = 1,
                CourseId = 1
            });

            Assert.IsType<OkObjectResult>(result);
            Assert.Single(context.Enrollments);
        }

        [Fact]
        public async Task Enroll_Returns_BadRequest_When_Already_Enrolled()
        {
            var context = CreateContext();
            await SeedStudent(context);
            await SeedCourse(context);
            await SeedEnrollment(context);
            var controller = new StudentController(context);

            var result = await controller.EnrollInCourse(new StudentController.EnrollRequest
            {
                StudentId = 1,
                CourseId = 1
            });

            var bad = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Student is already enrolled in this course.", bad.Value);
        }

        [Fact]
        public async Task GetMyEnrollments_Returns_NotFound_When_Student_Missing()
        {
            var context = CreateContext();
            var controller = new StudentController(context);

            var result = await controller.GetMyEnrollments(5);

            var notFound = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal("Student not found.", notFound.Value);
        }

        [Fact]
        public async Task GetMyEnrollments_Returns_Message_When_No_Enrollments()
        {
            var context = CreateContext();
            await SeedStudent(context);
            var controller = new StudentController(context);

            var result = await controller.GetMyEnrollments(1);

            var ok = Assert.IsType<OkObjectResult>(result);
            Assert.Contains("not enrolled", ok.Value.ToString());
        }

        [Fact]
        public async Task GetMyEnrollments_Returns_List_When_Exists()
        {
            var context = CreateContext();
            await SeedStudent(context);
            await SeedCourse(context);
            await SeedEnrollment(context);
            var controller = new StudentController(context);

            var result = await controller.GetMyEnrollments(1);

            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task Unenroll_Returns_Ok_When_Success()
        {
            var context = CreateContext();
            await SeedStudent(context);
            await SeedCourse(context);
            await SeedEnrollment(context);
            var controller = new StudentController(context);

            var result = await controller.UnenrollFromCourse(1, 1);

            Assert.IsType<OkObjectResult>(result);
            Assert.Empty(context.Enrollments);
        }

        [Fact]
        public async Task CompleteTopic_Creates_Record()
        {
            var context = CreateContext();
            await SeedStudent(context);
            await SeedCourse(context);
            await SeedTopic(context);
            var controller = new StudentController(context);

            var result = await controller.CompleteTopic(1, 1);

            Assert.IsType<OkObjectResult>(result);
            Assert.Single(context.TopicProgresses);
        }

        [Fact]
        public async Task StudentProgress_Returns_Correct_Percentage()
        {
            var context = CreateContext();
            await SeedStudent(context);
            await SeedCourse(context);
            await SeedTopic(context);
            await SeedProgress(context);
            var controller = new StudentController(context);

            var result = await controller.StudentProgress(1, 1);

            var ok = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(100d, ok.Value);
        }

        [Fact]
        public async Task GetStudentTopics_Returns_Topics_With_Progress()
        {
            var context = CreateContext();
            await SeedStudent(context);
            await SeedCourse(context);
            await SeedTopic(context);
            await SeedProgress(context);
            var controller = new StudentController(context);

            var result = await controller.GetStudentTopics(1, 1);

            Assert.IsType<OkObjectResult>(result);
        }
    }
}
