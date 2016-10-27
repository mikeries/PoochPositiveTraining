namespace PoochPositiveTraining.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class init : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Clients",
                c => new
                    {
                        ClientID = c.Int(nullable: false, identity: true),
                        FirstName = c.String(nullable: false, maxLength: 30),
                        LastName = c.String(nullable: false, maxLength: 30),
                        Phone = c.String(nullable: false),
                        Street1 = c.String(nullable: false, maxLength: 50),
                        Street2 = c.String(maxLength: 50),
                        City = c.String(nullable: false, maxLength: 20),
                        State = c.String(nullable: false, maxLength: 20),
                        Zip = c.String(maxLength: 12),
                        Email = c.String(nullable: false, maxLength: 40),
                        Note = c.String(),
                    })
                .PrimaryKey(t => t.ClientID);
            
            CreateTable(
                "dbo.Dogs",
                c => new
                    {
                        DogID = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false, maxLength: 30),
                        Breed = c.String(maxLength: 30),
                        Birthday = c.DateTime(),
                        Comments = c.String(),
                        ThumbnailID = c.Int(nullable: false),
                        ClientID = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.DogID)
                .ForeignKey("dbo.Clients", t => t.ClientID, cascadeDelete: true)
                .Index(t => t.ClientID);
            
            CreateTable(
                "dbo.Files",
                c => new
                    {
                        FileId = c.Int(nullable: false, identity: true),
                        FileName = c.String(maxLength: 255),
                        ContentType = c.String(maxLength: 100),
                        Content = c.Binary(),
                        FileType = c.Int(nullable: false),
                        DogID = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.FileId)
                .ForeignKey("dbo.Dogs", t => t.DogID, cascadeDelete: true)
                .Index(t => t.DogID);
            
            CreateTable(
                "dbo.FilePaths",
                c => new
                    {
                        FilePathId = c.Int(nullable: false, identity: true),
                        FileName = c.String(maxLength: 255),
                        FileType = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.FilePathId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Files", "DogID", "dbo.Dogs");
            DropForeignKey("dbo.Dogs", "ClientID", "dbo.Clients");
            DropIndex("dbo.Files", new[] { "DogID" });
            DropIndex("dbo.Dogs", new[] { "ClientID" });
            DropTable("dbo.FilePaths");
            DropTable("dbo.Files");
            DropTable("dbo.Dogs");
            DropTable("dbo.Clients");
        }
    }
}
