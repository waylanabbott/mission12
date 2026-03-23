import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Book, BookResponse } from '../types/Book';
import { useCart } from '../context/CartContext';
import CategoryFilter from './CategoryFilter';

function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalNumBooks, setTotalNumBooks] = useState(0);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { addToCart, totalItems, totalPrice } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);

      try {
        let url = `/api/books?pageNum=${pageNum}&pageSize=${pageSize}&sortOrder=${sortOrder}`;
        if (selectedCategory) {
          url += `&category=${encodeURIComponent(selectedCategory)}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }

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

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    setPageNum(1);
  };

  const handleAddToCart = (book: Book) => {
    addToCart(book);
  };

  const goToCart = () => {
    // Save current state so "Continue Shopping" can return here
    sessionStorage.setItem(
      'lastBookListState',
      JSON.stringify({ pageNum, pageSize, sortOrder, selectedCategory })
    );
    navigate('/cart');
  };

  // Restore state from sessionStorage on mount (for Continue Shopping)
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
      {/* Category sidebar */}
      <div className="col-md-3 mb-4">
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategoryChange}
        />
      </div>

      {/* Main content */}
      <div className="col-md-9">
        {/* Controls row */}
        <div className="row mb-3 align-items-center">
          <div className="col-auto">
            <label className="me-2">Books per page:</label>
            <select
              className="form-select d-inline-block w-auto"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPageNum(1);
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
                setPageNum(1);
              }}
            >
              Sort: {sortOrder === 'asc' ? 'A \u2192 Z' : 'Z \u2192 A'}
            </button>
          </div>
          <div className="col-auto ms-auto">
            <button className="btn btn-outline-success" onClick={goToCart}>
              Cart{' '}
              <span className="badge bg-danger rounded-pill">{totalItems}</span>{' '}
              - ${totalPrice.toFixed(2)}
            </button>
          </div>
        </div>

        {/* Book count */}
        <p className="text-muted">
          Showing page {pageNum} of {totalPages} ({totalNumBooks} total books)
          {selectedCategory && (
            <span>
              {' '}
              in <strong>{selectedCategory}</strong>
            </span>
          )}
        </p>

        {loading && <p className="text-center mt-4">Loading books...</p>}

        {error && (
          <p className="text-center text-danger mt-4">{error}</p>
        )}

        {!loading && !error && (
          <>
            {/* Books table */}
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

            {/* Pagination */}
            <nav>
              <ul className="pagination justify-content-center">
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
