using System;
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

        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        public Nullable<DateTime> Birthday { get; set; }

        public string Comments { get; set; }

        public FilePath Thumbnail { get; set; }

        [DisplayName("Owner")]
        public int ClientID { get; set; }

        public virtual Client Client { get; set; }
        
    }
}