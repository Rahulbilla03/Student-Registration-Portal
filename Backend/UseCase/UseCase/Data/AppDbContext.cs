using Microsoft.EntityFrameworkCore;
using UseCase.Controllers;
using UseCase.Data.Config;
using UseCase.Data.Configurations;
using UseCase.Model;

namespace UseCase.Data
{
    public class AppDbContext:DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }

        public DbSet<Student> Students { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<Enrollment> Enrollments { get; set; }
        public DbSet<Admin>Admins { get; set; }
        public DbSet<Topic> Topics { get; set; }
        public DbSet<TopicProgress> TopicProgresses { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
           
            modelBuilder.ApplyConfiguration(new CourseTable()); 
            modelBuilder.ApplyConfiguration(new EnrollmentTable());
            modelBuilder.ApplyConfiguration(new StudentTable());
            modelBuilder.ApplyConfiguration(new AdminTable());
            modelBuilder.ApplyConfiguration(new TopicTable());
            modelBuilder.ApplyConfiguration(new TopicProgressTable());
        }

    }
}
