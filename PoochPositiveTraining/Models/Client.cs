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

        public string Zip { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        public string Note { get; set; }

        public List<Dog> Dogs { get; set; }

    }
}