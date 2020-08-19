using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TransportesLeila.Models
{
    public class CommentContext : DbContext
    {
        public DbSet<CommentModel> Comments
        {
            get;
            set;
        }

        public CommentContext(DbContextOptions<CommentContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            string[] names = { "Simón", "Santi", "Berni" };
            string[] texts = { "hello", "fucking", "world" };
            // var comments = from n in names
            //                from t in texts
            //                select new CommentModel
            //                {
            //                    Author = n,
            //                    Text = t,
            //                    Verified = true
            //                };
            var comments = new List<CommentModel>(){
                new CommentModel() {Id = 1, Author = "Simón", Text = "Lorem Ipsum 1", Verified = true},
                new CommentModel() {Id = 2, Author = "Santi", Text = "Lorem Ipsum 2", Verified = false},
                new CommentModel() {Id = 3, Author = "Berni", Text = "Lorem Ipsum 3", Verified = true}
            };

            modelBuilder.Entity<CommentModel>().HasData(comments.ToArray());
        }
    }
}