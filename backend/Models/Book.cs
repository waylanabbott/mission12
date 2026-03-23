using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookstoreApi.Models;

// Book entity representing a book in the bookstore database
public class Book
{
    [Key]
    public int BookID { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public string Publisher { get; set; } = string.Empty;
    public string ISBN { get; set; } = string.Empty;
    public string Classification { get; set; } = string.Empty; // Fiction or Non-Fiction
    public string Category { get; set; } = string.Empty; // e.g. Biography, Self-Help, etc.
    public int PageCount { get; set; }
    public double Price { get; set; }
}
