using Microsoft.EntityFrameworkCore;
using BookstoreApi.Data;

// Create the web application builder
var builder = WebApplication.CreateBuilder(args);

// Register controller services for handling API requests
builder.Services.AddControllers();

// Add OpenAPI/Swagger support for API documentation
builder.Services.AddOpenApi();

// Register the Entity Framework database context with SQLite
// The connection string is stored in appsettings.json
builder.Services.AddDbContext<BookstoreContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("BookstoreConnection")));

// Configure CORS (Cross-Origin Resource Sharing) to allow
// the React frontend to make requests to this API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactDev", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
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
app.UseCors("AllowReactDev"); // Apply CORS policy
app.UseAuthorization();       // Enable authorization middleware
app.MapControllers();         // Map controller routes

// Start the application
app.Run();
