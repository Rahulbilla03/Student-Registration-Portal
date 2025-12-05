    using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using UseCase.Model;

namespace UseCase.Data.Config
{
    public class EnrollmentTable : IEntityTypeConfiguration<Enrollment>
    {
        public void Configure(EntityTypeBuilder<Enrollment> builder)
        {

            builder.ToTable("Enrollments");

            builder.HasOne(e => e.Student)
                   .WithMany(s => s.Enrollments)
                   .HasForeignKey(e => e.StudentId);

            builder.HasOne(e => e.Course)
                   .WithMany(s => s.Enrollments)
                   .HasForeignKey(e => e.CourseId);

            builder.HasIndex(n => new {n.StudentId,n.CourseId}).IsUnique();





        }
    }
}
