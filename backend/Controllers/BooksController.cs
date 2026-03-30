using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BookstoreApi.Data;
using BookstoreApi.Models;

namespace BookstoreApi.Controllers;

// API controller that handles all book-related HTTP requests.
// Supports reading, creating, updating, and deleting books.
[Route("api/[controller]")]
[ApiController]
public class BooksController : ControllerBase
{
    // Database context injected via dependency injection
    private readonly BookstoreContext _context;

    // Constructor - receives the database context from DI
    public BooksController(BookstoreContext context)
    {
        _context = context;
    }

    // GET /api/books
    // Returns a paginated list of books, optionally filtered by category
    // and sorted by title in ascending or descending order.
    [HttpGet]
    public async Task<IActionResult> GetBooks(
        int pageNum = 1,
        int pageSize = 5,
        string sortOrder = "asc",
        string? category = null)
    {
        // Start with all books in the database
        var query = _context.Books.AsQueryable();

        // Apply category filter if one was provided
        if (!string.IsNullOrEmpty(category))
        {
            query = query.Where(b => b.Category == category);
        }

        // Get the total count AFTER filtering for correct pagination
        var totalNumBooks = await query.CountAsync();

        // Sort alphabetically by title (ascending or descending)
        query = sortOrder.ToLower() == "desc"
            ? query.OrderByDescending(b => b.Title)
            : query.OrderBy(b => b.Title);

        // Apply pagination - skip previous pages and take only the current page
        var books = await query
            .Skip((pageNum - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        // Return the books along with pagination metadata
        var result = new
        {
            books,
            totalNumBooks,
            pageSize,
            currentPage = pageNum,
            totalPages = (int)Math.Ceiling((double)totalNumBooks / pageSize)
        };

        return Ok(result);
    }

    // GET /api/books/categories
    // Returns a sorted list of distinct book categories for the filter sidebar.
    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories()
    {
        // Select unique categories and sort them alphabetically
        var categories = await _context.Books
            .Select(b => b.Category)
            .Distinct()
            .OrderBy(c => c)
            .ToListAsync();

        return Ok(categories);
    }

    // GET /api/books/{id}
    // Returns a single book by its ID. Used when editing a book.
    [HttpGet("{id}")]
    public async Task<IActionResult> GetBook(int id)
    {
        // Look up the book by primary key
        var book = await _context.Books.FindAsync(id);

        // Return 404 if no book was found with that ID
        if (book == null)
        {
            return NotFound();
        }

        return Ok(book);
    }

    // POST /api/books
    // Creates a new book in the database.
    [HttpPost]
    public async Task<IActionResult> AddBook(Book book)
    {
        // Add the new book to the context and save to the database
        _context.Books.Add(book);
        await _context.SaveChangesAsync();

        // Return 201 Created with the location of the new resource
        return CreatedAtAction(nameof(GetBook), new { id = book.BookID }, book);
    }

    // PUT /api/books/{id}
    // Updates an existing book in the database.
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBook(int id, Book book)
    {
        // Ensure the URL id matches the book's ID to prevent mismatches
        if (id != book.BookID)
        {
            return BadRequest();
        }

        // Tell Entity Framework that this book has been modified
        _context.Entry(book).State = EntityState.Modified;

        // Save the changes to the database
        await _context.SaveChangesAsync();

        // Return 204 No Content to indicate success
        return NoContent();
    }

    // DELETE /api/books/{id}
    // Removes a book from the database.
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBook(int id)
    {
        // Find the book to delete
        var book = await _context.Books.FindAsync(id);

        // Return 404 if the book doesn't exist
        if (book == null)
        {
            return NotFound();
        }

        // Remove the book and save changes
        _context.Books.Remove(book);
        await _context.SaveChangesAsync();

        // Return 204 No Content to indicate success
        return NoContent();
    }
}
