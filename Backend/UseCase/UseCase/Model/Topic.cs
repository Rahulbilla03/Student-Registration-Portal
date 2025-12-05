using System.ComponentModel.DataAnnotations;

namespace UseCase.Model
{
    public class Topic
    {
        [Key]
        public int TopicId { get; set; }

        [Required]
        public string TopicName { get; set; }

        public int CourseId { get; set; }
        public Course Course { get; set; }
    }
}
