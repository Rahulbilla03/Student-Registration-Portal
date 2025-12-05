    using Microsoft.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore.Metadata.Builders;
    using UseCase.Model;

    namespace UseCase.Data.Config
    {
        public class CourseTable:IEntityTypeConfiguration<Course>
        {
        
            public void Configure(EntityTypeBuilder<Course> builder)
            {
                builder.ToTable("Courses");
                builder.HasKey(c => c.CourseId);
                builder.Property(c=>c.CourseName).IsRequired().HasMaxLength(200);
                builder.Property(c=>c.CourseCapacity).IsRequired();
                builder.HasIndex(c => c.CourseName);
            }
        }
    }
