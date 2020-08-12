using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TransportesLeila.Models;

namespace TransportesLeila.Controllers
{
    public class HomeController : Controller
    {
        private CommentContext _context;

        public HomeController(CommentContext context)
        {
            _context = context;
        }

        [Route("comments")]
        public ActionResult Comments()
        {
            return Json(_context.Comments.ToList());
        }

        [Route("comments/new")]
        [HttpPost]
        public ActionResult AddComment(CommentModel comment)
        {
            _context.Comments.Add(comment);
            _context.SaveChanges();
            return Content("Success :)");
        }
        public IActionResult Index()
        {
            return View();
        }
    }
}
