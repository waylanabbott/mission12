using Microsoft.EntityFrameworkCore;
using BookstoreApi.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddOpenApi();

// Configure SQLite database connection
builder.Services.AddDbContext<BookstoreContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("BookstoreConnection")));

// Configure CORS to allow requests from the React dev server
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactDev", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Enable OpenAPI in development mode
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Middleware pipeline
app.UseCors("AllowReactDev");
app.UseAuthorization();
app.MapControllers();

app.Run();
