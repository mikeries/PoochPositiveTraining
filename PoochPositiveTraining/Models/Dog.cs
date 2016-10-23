using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace PoochPositiveTraining.Models
{
    public class Dog
    {
        [Key]
        public int DogID { get; set; }

        [Required]
        [StringLength(30)]
        public string Name { get; set; }

        [StringLength(30)]
        public string Breed { get; set; }

        public string Comments { get; set; }

        [DisplayName("Owner")]
        public int ClientID { get; set; }

        public Client Client { get; set; }
        
    }
}