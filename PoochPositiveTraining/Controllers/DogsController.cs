
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using PoochPositiveTraining.Models;
using System.Text;

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
        public ActionResult Create([Bind(Include = "Name,Breed,Birthday,Comments,ClientID")] Dog dog, HttpPostedFileBase upload)
        {
            ModelState.Remove("DogID");
            if (ModelState.IsValid)
            {
                db.Dogs.Add(dog);
                db.SaveChanges();

                var thumbnail = new File
                {
                    FileType = FileType.Thumbnail,
                    DogID = dog.DogID,
                    Content = null
                };

                // Note: the javascript functions will add some additional formdata containing information for the edited thumbnail.
                // if present, use this instead of the uploaded file.
                string thumbtype = Request.Form["imageContentType"];
                string thumbData = Request.Form["imageSrc"];

                if (thumbtype != null && thumbData != null)  // user uploaded an edited image
                {
                    thumbnail.FileName = Request.Form["imageFileName"];
                    thumbnail.ContentType = thumbtype;
                    thumbnail.Content = Convert.FromBase64String(thumbData);
                }
                else if (upload != null && upload.ContentLength > 0)
                {
                    thumbnail.FileName = dog.Name + "-" + dog.DogID.ToString() + System.IO.Path.GetExtension(upload.FileName);
                    thumbnail.ContentType = upload.ContentType;

                    using (var reader = new System.IO.BinaryReader(upload.InputStream))
                    {
                        thumbnail.Content = reader.ReadBytes(upload.ContentLength);
                    }
                }

                if (thumbnail.Content != null)
                {
                    File oldThumb = db.Files.Find(dog.ThumbnailID);
                    if (oldThumb != null)
                    {
                        db.Files.Remove(oldThumb);
                    }

                    db.Files.Add(thumbnail);
                    db.SaveChanges();

                    dog.ThumbnailID = thumbnail.FileId;
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
        public ActionResult Edit([Bind(Include = "DogID,Name,Breed,Birthday,Comments,ClientID,ThumbnailID")] Dog dog, HttpPostedFileBase upload)
        {

            if (ModelState.IsValid)
            {
                db.Entry(dog).State = EntityState.Modified;

                var thumbnail = new File
                {
                    FileType = FileType.Thumbnail,
                    DogID = dog.DogID,
                    Content = null
                };

        // Note: the javascript functions will add some additional formdata containing information for the edited thumbnail.
        // if present, use this instead of the uploaded file.
                string thumbtype = Request.Form["imageContentType"];
                string thumbData = Request.Form["imageSrc"];

                if (thumbtype != null && thumbData != null)  // user uploaded an edited image
                {
                    thumbnail.FileName = Request.Form["imageFileName"];
                    thumbnail.ContentType = thumbtype;
                    thumbnail.Content = Convert.FromBase64String(thumbData);
                }
                else if (upload != null && upload.ContentLength > 0)
                {
                    thumbnail.FileName = dog.Name + "-" + dog.DogID.ToString() + System.IO.Path.GetExtension(upload.FileName);
                    thumbnail.ContentType = upload.ContentType;

                    using (var reader = new System.IO.BinaryReader(upload.InputStream))
                    {
                        thumbnail.Content = reader.ReadBytes(upload.ContentLength);
                    }
                }

                if (thumbnail.Content != null) { 
                    File oldThumb = db.Files.Find(dog.ThumbnailID);
                    if (oldThumb != null)
                    {
                        db.Files.Remove(oldThumb);
                    }

                    db.Files.Add(thumbnail);
                    db.SaveChanges();
                    dog.ThumbnailID = thumbnail.FileId;
                }
                   
                db.SaveChanges();
                return RedirectToAction("Details", "Clients", new { id = dog.ClientID });
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
