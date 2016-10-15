using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.IO;
using System.Web.Script.Serialization;
using PoochPositiveTraining.Models;

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
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}