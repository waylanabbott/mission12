import { useState, useEffect } from 'react';
import type { Book } from '../types/Book';

// Empty book template used to reset the form
const emptyBook: Book = {
  bookID: 0,
  title: '',
  author: '',
  publisher: '',
  isbn: '',
  classification: '',
  category: '',
  pageCount: 0,
  price: 0,
};

// Admin page for adding, editing, and deleting books
function AdminBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [formData, setFormData] = useState<Book>({ ...emptyBook });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all books when the component mounts
  useEffect(() => {
    fetchBooks();
  }, []);

  // Load all books from the API (no pagination needed for admin view)
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/books?pageSize=1000');
      const data = await response.json();
      setBooks(data.books);
    } catch {
      setError('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes for the form fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'pageCount' || name === 'price' ? Number(value) : value,
    });
  };

  // Handle form submission for both adding and editing
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      // Update an existing book
      await fetch(`/api/books/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    } else {
      // Add a new book
      await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    }

    // Reset form and refresh the book list
    setFormData({ ...emptyBook });
    setEditingId(null);
    fetchBooks();
  };

  // Populate the form with the selected book's data for editing
  const handleEdit = (book: Book) => {
    setFormData(book);
    setEditingId(book.bookID);
  };

  // Delete a book after confirming with the user
  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;

    await fetch(`/api/books/${id}`, { method: 'DELETE' });
    fetchBooks();
  };

  // Cancel editing and reset the form
  const handleCancel = () => {
    setFormData({ ...emptyBook });
    setEditingId(null);
  };

  if (loading) return <p className="text-center mt-4">Loading books...</p>;
  if (error) return <p className="text-center text-danger mt-4">{error}</p>;

  return (
    <div>
      <h2 className="mb-4">Admin - Manage Books</h2>

      {/* Add/Edit book form */}
      <div className="card mb-4">
        <div className="card-header">
          {editingId ? 'Edit Book' : 'Add New Book'}
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Author</label>
                <input
                  type="text"
                  className="form-control"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Publisher</label>
                <input
                  type="text"
                  className="form-control"
                  name="publisher"
                  value={formData.publisher}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">ISBN</label>
                <input
                  type="text"
                  className="form-control"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-3">
                <label className="form-label">Classification</label>
                <input
                  type="text"
                  className="form-control"
                  name="classification"
                  value={formData.classification}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Category</label>
                <input
                  type="text"
                  className="form-control"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Page Count</label>
                <input
                  type="number"
                  className="form-control"
                  name="pageCount"
                  value={formData.pageCount}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Price</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Submit and Cancel buttons */}
            <button type="submit" className="btn btn-primary me-2">
              {editingId ? 'Update Book' : 'Add Book'}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Books table with edit and delete actions */}
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.bookID}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.category}</td>
                <td>${book.price.toFixed(2)}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEdit(book)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(book.bookID)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminBooks;
