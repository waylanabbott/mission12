import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Book, BookResponse } from '../types/Book';
import { useCart } from '../context/CartContext';
import CategoryFilter from './CategoryFilter';

// Main book listing page.
// Displays books in a table with category filtering, pagination, sorting,
// and the ability to add books to the shopping cart.
// Uses Bootstrap Grid (row/col) for the sidebar + main content layout.
function BookList() {
  // State for book data and pagination
  const [books, setBooks] = useState<Book[]>([]);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalNumBooks, setTotalNumBooks] = useState(0);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get cart functions and totals from the cart context
  const { addToCart, totalItems, totalPrice } = useCart();
  const navigate = useNavigate();

  // Fetch books from the API whenever the page, page size, sort order,
  // or selected category changes
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);

      try {
        // Build the API URL with query parameters for pagination and filtering
        let url = `/api/books?pageNum=${pageNum}&pageSize=${pageSize}&sortOrder=${sortOrder}`;
        if (selectedCategory) {
          url += `&category=${encodeURIComponent(selectedCategory)}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }

        // Parse the response and update state
        const data: BookResponse = await response.json();
        setBooks(data.books);
        setTotalPages(data.totalPages);
        setTotalNumBooks(data.totalNumBooks);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [pageNum, pageSize, sortOrder, selectedCategory]);

  // When the user picks a new category, reset to page 1
  // so they don't land on an empty page
  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    setPageNum(1);
  };

  // Add a book to the shopping cart
  const handleAddToCart = (book: Book) => {
    addToCart(book);
  };

  // Save the current browsing state and navigate to the cart page.
  // This allows "Continue Shopping" to return the user to the same page.
  const goToCart = () => {
    sessionStorage.setItem(
      'lastBookListState',
      JSON.stringify({ pageNum, pageSize, sortOrder, selectedCategory })
    );
    navigate('/cart');
  };

  // On mount, restore the previous browsing state if the user clicked
  // "Continue Shopping" from the cart page
  useEffect(() => {
    const saved = sessionStorage.getItem('lastBookListState');
    if (saved) {
      const state = JSON.parse(saved);
      setPageNum(state.pageNum);
      setPageSize(state.pageSize);
      setSortOrder(state.sortOrder);
      setSelectedCategory(state.selectedCategory);
      sessionStorage.removeItem('lastBookListState');
    }
  }, []);

  return (
    <div className="row">
      {/* Left sidebar: category filter (Bootstrap Grid col-md-3) */}
      <div className="col-md-3 mb-4">
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategoryChange}
        />
      </div>

      {/* Right side: main content area (Bootstrap Grid col-md-9) */}
      <div className="col-md-9">
        {/* Controls row: page size selector, sort button, and cart summary */}
        <div className="row mb-3 align-items-center">
          <div className="col-auto">
            <label className="me-2">Books per page:</label>
            <select
              className="form-select d-inline-block w-auto"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPageNum(1); // Reset to page 1 when changing page size
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
          </div>
          <div className="col-auto">
            <button
              className="btn btn-outline-primary"
              onClick={() => {
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                setPageNum(1); // Reset to page 1 when changing sort
              }}
            >
              Sort: {sortOrder === 'asc' ? 'A → Z' : 'Z → A'}
            </button>
          </div>

          {/* Cart summary button showing item count and total price */}
          <div className="col-auto ms-auto">
            <button className="btn btn-outline-success" onClick={goToCart}>
              Cart{' '}
              <span className="badge bg-danger rounded-pill">{totalItems}</span>{' '}
              - ${totalPrice.toFixed(2)}
            </button>
          </div>
        </div>

        {/* Show current page info and active category filter */}
        <p className="text-muted">
          Showing page {pageNum} of {totalPages} ({totalNumBooks} total books)
          {selectedCategory && (
            <span>
              {' '}
              in <strong>{selectedCategory}</strong>
            </span>
          )}
        </p>

        {/* Loading and error states */}
        {loading && <p className="text-center mt-4">Loading books...</p>}
        {error && (
          <p className="text-center text-danger mt-4">{error}</p>
        )}

        {/* Book table and pagination - only shown when data is loaded */}
        {!loading && !error && (
          <>
            {/* Books table wrapped in table-responsive for smaller screens */}
            <div className="table-responsive">
              <table className="table table-striped table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Publisher</th>
                    <th>ISBN</th>
                    <th>Classification</th>
                    <th>Category</th>
                    <th>Pages</th>
                    <th>Price</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {/* Render a row for each book */}
                  {books.map((book) => (
                    <tr key={book.bookID}>
                      <td>{book.title}</td>
                      <td>{book.author}</td>
                      <td>{book.publisher}</td>
                      <td>{book.isbn}</td>
                      <td>{book.classification}</td>
                      <td>{book.category}</td>
                      <td>{book.pageCount}</td>
                      <td>${book.price.toFixed(2)}</td>
                      <td>
                        {/* Add to Cart button for each book */}
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleAddToCart(book)}
                        >
                          Add to Cart
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination controls using Bootstrap pagination component */}
            <nav>
              <ul className="pagination justify-content-center">
                {/* Previous page button - disabled on first page */}
                <li
                  className={`page-item ${pageNum === 1 ? 'disabled' : ''}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setPageNum(pageNum - 1)}
                  >
                    Previous
                  </button>
                </li>

                {/* Numbered page buttons - highlights the active page */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (num) => (
                    <li
                      key={num}
                      className={`page-item ${num === pageNum ? 'active' : ''}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setPageNum(num)}
                      >
                        {num}
                      </button>
                    </li>
                  )
                )}

                {/* Next page button - disabled on last page */}
                <li
                  className={`page-item ${
                    pageNum === totalPages ? 'disabled' : ''
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setPageNum(pageNum + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </>
        )}
      </div>
    </div>
  );
}

export default BookList;
