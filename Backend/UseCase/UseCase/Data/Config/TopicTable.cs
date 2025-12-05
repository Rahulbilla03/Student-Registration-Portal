using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using UseCase.Model;

namespace UseCase.Data.Configurations
{
    public class TopicTable : IEntityTypeConfiguration<Topic>
    {
        public void Configure(EntityTypeBuilder<Topic> builder)
        {
            builder.HasKey(t => t.TopicId);

            builder.Property(t => t.TopicName)
                   .IsRequired()
                   .HasMaxLength(150);

            builder.HasOne(t => t.Course)
                   .WithMany(c => c.Topics)
                   .HasForeignKey(t => t.CourseId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
