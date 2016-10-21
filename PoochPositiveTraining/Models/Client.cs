using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace PoochPositiveTraining.Models
{
    public class Client
    {
        [Key]
        public int ClientID { get; set; }

        [Required]
        [StringLength(30)]
        public string FirstName { get; set; }

        [Required]
        [StringLength(30)]
        public string LastName { get; set; }

        public string Name { get { return FirstName + " " + LastName; } }

        [Required]
        [Phone]
        [DisplayFormat(DataFormatString = "{0:###-###-####}")]
        public long Phone { get; set; }

        [Required]
        [StringLength(50)]
        public string Street1 { get; set; }

        [StringLength(50)]
        public string Street2 { get; set; }


        [Required]
        [StringLength(20)]
        public string City { get; set; }

        [Required]
        [StringLength(20)]
        public string State { get; set; }

        [Required]
        // TODO:  Figure out the JQuery validator libraries to validate a zipcode:  Formvalidation.io
        public int Zip { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        public string Note { get; set; }

        public List<Dog> Dogs { get; set; }

    }
}