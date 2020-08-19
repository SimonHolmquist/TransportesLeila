using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

        [Route("comments/check")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,Author,Text")] CommentModel comment)
        {
            if (id != comment.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(comment);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!CommentExists(comment.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return Content("Piola");
        }
        public IActionResult Index()
        {
            return View();
        }

        private bool CommentExists(int id)
        {
            return _context.Comments.Any(e => e.Id == id);
        }
    }
}
