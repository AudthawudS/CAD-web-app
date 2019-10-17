using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using System.Web.Mvc.Ajax;

namespace WebApplication2.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult UploadFile()
        {
            string _modelname = string.Empty;
            string json = "";

            string fName = Request.Params["uploadfile"];
            if (String.IsNullOrEmpty(fName) ||
                Request.InputStream == null ||
                Request.InputStream.Length == 0)
            {
                throw new Exception("Upload filename not set");
            }

            if (fName.ToString().ToUpper().Contains("STL"))
            {
                var longpath = Path.Combine(Server.MapPath("~/STLFile"), "File.stl");
                var fileStream = new FileStream(longpath, FileMode.Create, FileAccess.Write);
                Request.InputStream.CopyTo(fileStream);
                fileStream.Dispose();
                json = longpath;
            }
            else if (fName.ToString().ToUpper().Contains("DAE"))
            {
                var longpath = Path.Combine(Server.MapPath("~/DAEFile"), "File.dae");
                var fileStream = new FileStream(longpath, FileMode.Create, FileAccess.Write);
                Request.InputStream.CopyTo(fileStream);
                fileStream.Dispose();
                json = longpath;
            }
            else
                json = new StreamReader(Request.InputStream).ReadToEnd();

            return Json(new { success = true, model = json });
        }
    }
}
