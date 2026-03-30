using Microsoft.EntityFrameworkCore;
using BookstoreApi.Data;

// Create the web application builder
var builder = WebApplication.CreateBuilder(args);

// Register controller services for handling API requests
builder.Services.AddControllers();

// Add OpenAPI/Swagger support for API documentation
builder.Services.AddOpenApi();

// On Azure, copy the SQLite database to a writable location (/tmp)
// since the deployed app directory is read-only
var dbSource = Path.Combine(builder.Environment.ContentRootPath, "Bookstore.sqlite");
var dbPath = dbSource;
if (!builder.Environment.IsDevelopment())
{
    dbPath = "/tmp/Bookstore.sqlite";
    if (!File.Exists(dbPath) && File.Exists(dbSource))
    {
        File.Copy(dbSource, dbPath);
    }
}

// Register the Entity Framework database context with SQLite
// Uses the writable path on Azure, or the local path in development
builder.Services.AddDbContext<BookstoreContext>(options =>
    options.UseSqlite($"Data Source={dbPath}"));

// Configure CORS (Cross-Origin Resource Sharing) to allow
// the React frontend to make requests to this API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Build the application
var app = builder.Build();

// Enable OpenAPI endpoint only in development mode
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Set up the middleware pipeline
app.UseCors("AllowAll");      // Apply CORS policy
app.UseAuthorization();       // Enable authorization middleware
app.MapControllers();         // Map controller routes

// Start the application
app.Run();
