using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace PoochPositiveTraining.Models
{
    public class Client
    {
        public int ClientID { get; set; }

        [Required]
        [StringLength(30)]
        public string FirstName { get; set; }

        [Required]
        [StringLength(30)]
        public string LastName { get; set; }

        public string Name { get { return FirstName + " " + LastName; } }

        [Phone]
        [Required]
        [RegularExpression(@"^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$", ErrorMessage = "Invalid Phone")]
        public string Phone { get; set; }

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

        [RegularExpression(@"^\d{5}(-\d{4})?$", ErrorMessage = "Invalid Zip")]
        [StringLength(12)]
        public string Zip { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(40)]
        public string Email { get; set; }

        public string Note { get; set; }

        public virtual List<Dog> Dogs { get; set; }

    }
}