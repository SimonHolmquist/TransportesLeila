using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TransportesLeila.Models
{
    [Table("Comments")]
    public class CommentModel
    {
        private int id;
        private string author;
        private string text;
        private bool verified;

        public int Id { get => id; set => id = value; }
        [Display(Name = "Author")]  
        [Required(ErrorMessage = "Author is required")]
        public string Author { get => author; set => author = value; }
        [Display(Name = "Text")]  
        [Required(ErrorMessage = "Text is required")]
        public string Text { get => text; set => text = value; }

        public bool Verified { get => verified; set => verified = value; }
    }
}
