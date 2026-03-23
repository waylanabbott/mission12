using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BookstoreApi.Data;

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
}
