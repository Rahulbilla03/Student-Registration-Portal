using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace UseCase.Model
{
    public class Student
    {
        [Key]
        public int StudentId { get; set; }
        [Required]
        public string UserName { get; set; }
        [Required]
        [StringLength(20, MinimumLength = 6, ErrorMessage = "Password must be between 6 and 20 characters.")]
        public string Password { get; set; }

        [Phone]
        public string Phone { get; set; }
        [Required]
        public string Address {  get; set; }
        [Required]  
        //[EmailAddress]
        public string EmailId {  get; set; }

        [Required]
        public DateTime DOB { get; set; }
        
        public DateTime CreatedAt {  get; set; }= DateTime.Now;

       
        
        [JsonIgnore]
        public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
        [JsonIgnore]
        public ICollection<TopicProgress> TopicProgresses { get; set; } = new List<TopicProgress>();






    }
}
