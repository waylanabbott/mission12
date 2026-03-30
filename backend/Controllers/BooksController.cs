using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BookstoreApi.Data;
using BookstoreApi.Models;

namespace BookstoreApi.Controllers;

// API controller for managing book data
[Route("api/[controller]")]
[ApiController]
public class BooksController : ControllerBase
{
    private readonly BookstoreContext _context;

    public BooksController(BookstoreContext context)
    {
        _context = context;
    }

    // GET /api/books - Returns paginated, sorted, and optionally filtered books
    [HttpGet]
    public async Task<IActionResult> GetBooks(
        int pageNum = 1,
        int pageSize = 5,
        string sortOrder = "asc",
        string? category = null)
    {
        var query = _context.Books.AsQueryable();

        // Filter by category if a category is selected
        if (!string.IsNullOrEmpty(category))
        {
            query = query.Where(b => b.Category == category);
        }

        // Count after filtering so pagination reflects the filtered set
        var totalNumBooks = await query.CountAsync();

        // Sort by title ascending or descending
        query = sortOrder.ToLower() == "desc"
            ? query.OrderByDescending(b => b.Title)
            : query.OrderBy(b => b.Title);

        // Apply pagination using Skip and Take
        var books = await query
            .Skip((pageNum - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        // Build response with pagination metadata
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

    // GET /api/books/categories - Returns a list of distinct book categories
    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories()
    {
        var categories = await _context.Books
            .Select(b => b.Category)
            .Distinct()
            .OrderBy(c => c)
            .ToListAsync();

        return Ok(categories);
    }

    // GET /api/books/{id} - Returns a single book by its ID
    [HttpGet("{id}")]
    public async Task<IActionResult> GetBook(int id)
    {
        var book = await _context.Books.FindAsync(id);

        // Return 404 if the book doesn't exist
        if (book == null)
        {
            return NotFound();
        }

        return Ok(book);
    }

    // POST /api/books - Adds a new book to the database
    [HttpPost]
    public async Task<IActionResult> AddBook(Book book)
    {
        _context.Books.Add(book);
        await _context.SaveChangesAsync();

        // Return 201 Created with the new book
        return CreatedAtAction(nameof(GetBook), new { id = book.BookID }, book);
    }

    // PUT /api/books/{id} - Updates an existing book in the database
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBook(int id, Book book)
    {
        // Make sure the ID in the URL matches the book object
        if (id != book.BookID)
        {
            return BadRequest();
        }

        // Mark the book as modified so EF knows to update it
        _context.Entry(book).State = EntityState.Modified;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE /api/books/{id} - Removes a book from the database
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBook(int id)
    {
        var book = await _context.Books.FindAsync(id);

        // Return 404 if the book doesn't exist
        if (book == null)
        {
            return NotFound();
        }

        _context.Books.Remove(book);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
