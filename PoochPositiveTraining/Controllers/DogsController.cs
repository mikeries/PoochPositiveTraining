using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using PoochPositiveTraining.Models;
using System.IO;

namespace PoochPositiveTraining.Controllers
{
    public class DogsController : Controller
    {
        private PoochPositiveTrainingContext db = new PoochPositiveTrainingContext();

        public ActionResult DropTest()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult DropTest(HttpPostedFileBase upload)
        {
            if (ModelState.IsValid)
            {

                return RedirectToAction("Index", "Clients");
            }

            return View();
        }



        // GET: Dogs/Create
        public ActionResult Create(int? clientID)
        {
            if (clientID == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }

            ViewBag.ClientID = new SelectList(db.Clients, "ClientID", "Name", clientID);
            ViewBag.Owner = clientID;
            return View();
        }

        // POST: Dogs/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "DogID,Name,Breed,Birthday,Comments,ClientID")] Dog dog, HttpPostedFileBase upload)
        {
            if (ModelState.IsValid)
            {
                db.Dogs.Add(dog);
                db.SaveChanges();

                if (upload != null && upload.ContentLength > 0)
                {
                    var photo = new FilePath
                    {
                        FileName = dog.Name + "-" + dog.DogID.ToString() + System.IO.Path.GetExtension(upload.FileName),
                        FileType = FileType.Photo
                    };

                    dog.Thumbnail = photo;
                    upload.SaveAs(Path.Combine(Server.MapPath("~/images/thumbnails"), photo.FileName));
                    db.SaveChanges();
                }

                return RedirectToAction("Details", "Clients", new { id = dog.ClientID });
            }

            ViewBag.ClientID = new SelectList(db.Clients, "ClientID", "Name", dog.ClientID);
            ViewBag.Owner = dog.ClientID;
            return View(dog);
        }

        // GET: Dogs/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Dog dog = db.Dogs.Find(id);
            if (dog == null)
            {
                return HttpNotFound();
            }
            ViewBag.ClientID = new SelectList(db.Clients, "ClientID", "Name", dog.ClientID);
            return View(dog);
        }

        // POST: Dogs/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "DogID,Name,Breed,Birthday,Comments,ClientID")] Dog dog)
        {
            if (ModelState.IsValid)
            {
                db.Entry(dog).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Details", "Clients", new { id = dog.ClientID});
            }
            ViewBag.ClientID = new SelectList(db.Clients, "ClientID", "Name", dog.ClientID);
            return View(dog);
        }

        // GET: Dogs/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Dog dog = db.Dogs.Find(id);
            if (dog == null)
            {
                return HttpNotFound();
            }
            return View(dog);
        }

        // POST: Dogs/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            Dog dog = db.Dogs.Find(id);
            db.Dogs.Remove(dog);
            db.SaveChanges();
            return RedirectToAction("Details", "Clients", new { id = dog.ClientID });
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
