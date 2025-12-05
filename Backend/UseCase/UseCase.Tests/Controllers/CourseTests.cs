using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UseCase.Controllers;
using UseCase.Data;
using UseCase.Model;
using Xunit;

namespace UseCase.Tests.Controllers
{
    public class CourseTests
    {
        private AppDbContext CreateContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            return new AppDbContext(options);
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

        private async Task SeedTopics(AppDbContext context)
        {
            context.Topics.AddRange(
                new Topic { TopicId = 1, CourseId = 1, TopicName = "Intro" },
                new Topic { TopicId = 2, CourseId = 1, TopicName = "Basics" }
            );

            await context.SaveChangesAsync();
        }

        [Fact]
        public async Task GetCourseById_Returns_BadRequest_When_Id_Invalid()
        {
            var context = CreateContext();
            var controller = new CourseController(context);

            var result = await controller.GetCourseById(0);

            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task GetCourseById_Returns_NotFound_When_No_Course()
        {
            var context = CreateContext();
            var controller = new CourseController(context);

            var result = await controller.GetCourseById(1);

            var notFound = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal("Course not found.", notFound.Value);
        }

        [Fact]
        public async Task GetCourseById_Returns_Ok_When_Found()
        {
            var context = CreateContext();
            await SeedCourse(context);

            var controller = new CourseController(context);

            var result = await controller.GetCourseById(1);

            var ok = Assert.IsType<OkObjectResult>(result);
            var list = ok.Value as IEnumerable<object>;

            Assert.NotNull(list);
            Assert.Single(list);
        }

        [Fact]
        public async Task CreateCourse_Returns_BadRequest_When_Name_Empty()
        {
            var context = CreateContext();
            var controller = new CourseController(context);

            var result = await controller.CreateCourse(new Course());

            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task CreateCourse_Returns_BadRequest_When_Capacity_Zero()
        {
            var context = CreateContext();
            var controller = new CourseController(context);

            var result = await controller.CreateCourse(new Course
            {
                CourseName = "Angular",
                CourseCapacity = 0
            });

            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task CreateCourse_Returns_BadRequest_When_Duplicate()
        {
            var context = CreateContext();
            await SeedCourse(context);

            var controller = new CourseController(context);

            var result = await controller.CreateCourse(new Course
            {
                CourseName = "c#",
                CourseCapacity = 5
            });

            var bad = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Contains("already exists", bad.Value.ToString());
        }

        [Fact]
        public async Task CreateCourse_Saves_Course()
        {
            var context = CreateContext();
            var controller = new CourseController(context);

            var result = await controller.CreateCourse(new Course
            {
                CourseName = "React",
                CourseCapacity = 25
            });

            Assert.IsType<OkObjectResult>(result);
            Assert.Equal(1, await context.Courses.CountAsync());
        }

        [Fact]
        public async Task AddTopic_Saves_Topic()
        {
            var context = CreateContext();
            await SeedCourse(context);

            var controller = new CourseController(context);

            var result = await controller.AddTopic(1, "Intro");

            Assert.IsType<OkObjectResult>(result);
            Assert.Single(context.Topics);
        }

        [Fact]
        public async Task GetTopics_Returns_All_Topics()
        {
            var context = CreateContext();
            await SeedCourse(context);
            await SeedTopics(context);

            var controller = new CourseController(context);

            var result = await controller.GetTopics(1);

            var ok = Assert.IsType<OkObjectResult>(result);
            var topics = ok.Value as IEnumerable<object>;

            Assert.NotNull(topics);
            Assert.Equal(2, topics.Count());
        }

        [Fact]
        public async Task UpdateCourse_Returns_NotFound()
        {
            var context = CreateContext();
            var controller = new CourseController(context);

            var result = await controller.UpdateCourse(1, new Course());

            var notFound = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal("Course not found.", notFound.Value);
        }

        [Fact]
        public async Task UpdateCourse_Returns_BadRequest_When_Duplicate()
        {
            var context = CreateContext();

            context.Courses.AddRange(
                new Course { CourseId = 1, CourseName = "C#", CourseCapacity = 10 },
                new Course { CourseId = 2, CourseName = "Java", CourseCapacity = 15 }
            );

            await context.SaveChangesAsync();

            var controller = new CourseController(context);

            var result = await controller.UpdateCourse(2, new Course
            {
                CourseName = "c#",
                CourseCapacity = 20
            });

            var bad = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Course already exists.", bad.Value);
        }

        [Fact]
        public async Task UpdateCourse_Updates_Successfully()
        {
            var context = CreateContext();
            await SeedCourse(context);

            var controller = new CourseController(context);

            var result = await controller.UpdateCourse(1, new Course
            {
                CourseName = "ASP.NET",
                CourseCapacity = 50
            });

            Assert.IsType<OkObjectResult>(result);

            var course = await context.Courses.FirstAsync();
            Assert.Equal("ASP.NET", course.CourseName);
            Assert.Equal(50, course.CourseCapacity);
        }
    }
}
