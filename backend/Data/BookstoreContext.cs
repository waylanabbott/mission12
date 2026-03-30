using Microsoft.EntityFrameworkCore;
using BookstoreApi.Models;

namespace BookstoreApi.Data;

// Entity Framework Core database context for the bookstore application.
// This class connects the Book model to the SQLite database.
public class BookstoreContext : DbContext
{
    // Constructor that passes configuration options to the base DbContext
    public BookstoreContext(DbContextOptions<BookstoreContext> options)
        : base(options) { }

    // DbSet representing the Books table in the database.
    // Each Book object maps to a row in the table.
    public DbSet<Book> Books { get; set; }
}
