using Microsoft.EntityFrameworkCore;
using BookstoreApi.Models;

namespace BookstoreApi.Data;

// Entity Framework Core database context for the bookstore
public class BookstoreContext : DbContext
{
    public BookstoreContext(DbContextOptions<BookstoreContext> options)
        : base(options) { }

    // Books table in the SQLite database
    public DbSet<Book> Books { get; set; }
}
