using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace PoochPositiveTraining.Models
{
    public class PoochPositiveTrainingContext : DbContext
    {
        // You can add custom code to this file. Changes will not be overwritten.
        // 
        // If you want Entity Framework to drop and regenerate your database
        // automatically whenever you change your model schema, please use data migrations.
        // For more information refer to the documentation:
        // http://msdn.microsoft.com/en-us/data/jj591621.aspx
    
        public PoochPositiveTrainingContext()
            : base(Helpers.GetRDSConnection() ?? "DefaultConnection")
        {
        }

        public DbSet<Client> Clients { get; set; }

        public DbSet<Dog> Dogs { get; set; }

        public DbSet<FilePath> FilePaths { get; set; }

        public DbSet<File> Files { get; set; }
    }
}
