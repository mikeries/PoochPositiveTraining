using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.IO;
using System.Web.Script.Serialization;
using PoochPositiveTraining.Models;
using Microsoft.AspNet.Identity;
using System.Threading.Tasks;
using System.Net;
using System.Net.Mail;
using System.Configuration;

namespace PoochPositiveTraining.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            string path = Server.MapPath("~/App_Data/dogfacts.json");
            string json = System.IO.File.ReadAllText(path);
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            Facts dogFacts = serializer.Deserialize<Facts>(json);
            ViewBag.Fact = dogFacts.RandomFact();

            return View();
        }

        public ActionResult About()
        {
            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Send us an email.";

            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Contact(EmailFormModel model)
        {
            if (ModelState.IsValid)
            {
                var message = new MailMessage();
                string supportAddress = ConfigurationManager.AppSettings["SupportEmailAddress"];
                message.To.Add(new MailAddress(supportAddress));
                message.From = new MailAddress(supportAddress);
                message.Subject = "Pooch Positive Contact";

                var body = "<p>{0} ({1}) just sent the following from the Pooch Positive Training contact page.</p><p>Message:</p><p>{2}</p>";
                message.Body = string.Format(body, model.FromName, model.FromEmail, model.Message);
                message.IsBodyHtml = true;

                using (var smtp = new SmtpClient())
                {
                    await smtp.SendMailAsync(message);
                    return RedirectToAction("Sent");
                }
            }
            return View(model);
        }

        public ActionResult Sent()
        {
            return View();
        }
    }
}