using System.Web.Mvc;

namespace AppFutbol.Controllers
{
    public class AppController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Matches()
        {
            return View();
        }
    }
}