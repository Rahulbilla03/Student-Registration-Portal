using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using UseCase.Controllers;
using UseCase.Data;
using UseCase.Model;
using Xunit;

namespace UseCase.Tests.Controllers
{
    public class AdminTests
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
                EmailId = "rahul@tgmail.com",
                Address = "HYD",
                Phone = "1234566789",
                Password = "password",
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

        [Fact]
        public async Task Register_Should_Return_Ok_When_Student_Is_Valid()
        {
            var context = CreateContext();
            var controller = new AdminController(context);

            var student = new Student
            {
                UserName = "rahul",
                EmailId = "rahul@test.com",
                Address = "India",
                Phone = "9999",
                Password = "654321",
                DOB = DateTime.Now
            };

            var result = await controller.Register(student);

            var ok = Assert.IsType<OkObjectResult>(result);
            Assert.Equal("Student registered successfully", ok.Value);
        }

        [Fact]
        public async Task Register_Should_Return_BadRequest_When_Duplicate_Username()
        {
            var context = CreateContext();
            await SeedStudent(context);

            var controller = new AdminController(context);

            var student = new Student
            {
                UserName = "rahul",
                EmailId = "rahul@gmail.com",
                Address = "Hyd",
                Phone = "8123455888",
                Password = "654321",
                DOB = DateTime.Now
            };

            var result = await controller.Register(student);

            var bad = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Contains("already exists", bad.Value.ToString());
        }

        [Fact]
        public async Task GetAllCourses_Should_Return_List()
        {
            var context = CreateContext();
            await SeedCourse(context);

            var controller = new AdminController(context);

            var result = await controller.GetAllCourses();

            var ok = Assert.IsType<OkObjectResult>(result);
            var data = ok.Value as IEnumerable<object>;

            Assert.NotNull(data);
            Assert.Single(data);
        }

        [Fact]
        public async Task GetAllStudents_Should_Return_List()
        {
            var context = CreateContext();
            await SeedStudent(context);

            var controller = new AdminController(context);

            var result = await controller.GetAllStudents();

            var ok = Assert.IsType<OkObjectResult>(result);
            var data = ok.Value as IEnumerable<object>;

            Assert.NotNull(data);
            Assert.Single(data);
        }

        [Fact]
        public async Task GetAllEnrollments_Should_Return_Empty_Message()
        {
            var context = CreateContext();

            var controller = new AdminController(context);

            var result = await controller.GetAllEnrollments();

            var ok = Assert.IsType<OkObjectResult>(result);

            Assert.Equal("No enrollments found yet", ok.Value);
        }

        [Fact]
        public async Task DeleteCourse_Should_Remove_Record()
        {
            var context = CreateContext();
            await SeedCourse(context);

            var controller = new AdminController(context);

            var result = await controller.DeleteCourse(1);

            var ok = Assert.IsType<OkObjectResult>(result);

            var course = await context.Courses.FirstOrDefaultAsync();
            Assert.Null(course);
        }

        [Fact]
        public async Task GetByUsername_Should_Return_Student()
        {
            var context = CreateContext();
            await SeedStudent(context);

            var controller = new AdminController(context);

            var result = await controller.GetAllDeatils("rahul");

            var ok = Assert.IsType<OkObjectResult>(result);
            var student = Assert.IsType<Student>(ok.Value);

            Assert.Equal("rahul", student.UserName);
        }

        [Fact]
        public async Task CourseProgress_Should_Return_List()
        {
            var context = CreateContext();
            await SeedStudent(context);
            await SeedCourse(context);

            context.Enrollments.Add(new Enrollment
            {
                StudentId = 1,
                CourseId = 1
            });

            context.Topics.Add(new Topic
            {
                TopicId = 1,
                TopicName = "Intro",
                CourseId = 1
            });

            context.TopicProgresses.Add(new TopicProgress
            {
                StudentId = 1,
                TopicId = 1
            });

            await contextSave(context);

            var controller = new AdminController(context);

            var result = await controller.CourseProgress(1);

            var ok = Assert.IsType<OkObjectResult>(result);
            var data = ok.Value as IEnumerable<object>;

            Assert.NotNull(data);
            Assert.Single(data);
        }

        private async Task contextSave(AppDbContext context)
        {
            await context.SaveChangesAsync();
        }
    }
}
