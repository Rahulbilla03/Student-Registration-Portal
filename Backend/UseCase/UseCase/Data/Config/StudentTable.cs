using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using UseCase.Model;

namespace UseCase.Data.Config
{
    public class StudentTable : IEntityTypeConfiguration<Student>
    {

        public void Configure(EntityTypeBuilder<Student> builder)
        {
           
            builder.ToTable("Students");
            builder.HasKey(s => s.StudentId);
            builder.Property(s => s.UserName).IsRequired().HasMaxLength(50);
            builder.HasIndex(s => s.UserName).IsUnique();
            builder.Property(s=> s.Address).IsRequired().HasMaxLength(100);
            builder.Property(s => s.EmailId).IsRequired().HasMaxLength(30);
            builder.HasIndex(s => s.EmailId).IsUnique();
            builder.Property(s => s.Phone).HasMaxLength(10);
            builder.Property(s=>s.DOB).IsRequired();
        }

    }
}
