using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TransportesLeila.Models
{
    public class CommentModel
    {
        private int id;
        private string author;
        private string text;

        public int Id { get => id; set => id = value; }
        public string Author { get => author; set => author = value; }
        public string Text { get => text; set => text = value; }
    }
}
