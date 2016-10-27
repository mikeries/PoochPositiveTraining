using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace PoochPositiveTraining.Models
{
    public class PoochPositiveTrainingContextInitializer : DropCreateDatabaseAlways<PoochPositiveTrainingContext>
    {
        protected override void Seed(PoochPositiveTrainingContext context)
        {
            Client client = new Client()
            {
                FirstName = "Mike",
                LastName = "Ries",
                Phone = "(314)779-4525",
                Email = "Michael.ries@gmail.com",
                Street1 = "4207 Eagle Rock Ct.",
                City = "Saint Charles",
                State = "MO",
                Zip = "63304",
            };

            context.Clients.Add(client);

            context.Clients.Add(new Client()
            {
                FirstName = "Michelle",
                LastName = "Charboneau",
                Phone = "(314)222-2222",
                Email = "fake@home.net",
                Street1 = "4207 Eagle Rock Ct.",
                City = "Saint Charles",
                State = "MO",
                Zip = "63304",
            });

            context.SaveChanges();
        }
    }
}