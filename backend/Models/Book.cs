using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookstoreApi.Models;

// Book entity model that maps to the Books table in the SQLite database.
// Each property corresponds to a column in the table.
public class Book
{
    [Key]
    public int BookID { get; set; }             // Primary key
    public string Title { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public string Publisher { get; set; } = string.Empty;
    public string ISBN { get; set; } = string.Empty;
    public string Classification { get; set; } = string.Empty; // Fiction or Non-Fiction
    public string Category { get; set; } = string.Empty;       // e.g. Biography, Self-Help
    public int PageCount { get; set; }
    public double Price { get; set; }
}
