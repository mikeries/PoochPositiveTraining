using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PoochPositiveTraining.Models
{
    public class Facts
    {
        public string[] facts;

        public string RandomFact() {
            Random rand = new Random();
            int fact = rand.Next(0, facts.Length);
            return facts[fact];
        }
    }
}