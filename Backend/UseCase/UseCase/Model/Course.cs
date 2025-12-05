using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using UseCase.Model;

public class Course
{
    [Key] 
    public int CourseId { get; set; }
    [Required]
    public string CourseName { get; set; } = string.Empty;

    //[Range(1, int.MaxValue, ErrorMessage = "Course capacity must be greater than zero.")]
    public int CourseCapacity { get; set; }

    [JsonIgnore]  
    public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
    [JsonIgnore]  
    public ICollection<Topic> Topics { get; set; } = new List<Topic>();



}
