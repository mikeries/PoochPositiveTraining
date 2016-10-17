using System.ComponentModel.DataAnnotations;

namespace PoochPositiveTraining.Models
{
    public class EmailFormModel
    {
        [Required(ErrorMessage="Please tell us your name."), Display(Name = "Your name")]
        public string FromName { get; set; }

        [Required(ErrorMessage="Email is required."), Display(Name = "Your email"), EmailAddress]
        public string FromEmail { get; set; }
        [Required]
        public string Message { get; set; }
    }
}