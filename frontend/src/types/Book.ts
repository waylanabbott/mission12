// Represents a single book from the API.
// Each field matches a column in the Books database table.
export interface Book {
  bookID: number;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  classification: string;
  category: string;
  pageCount: number;
  price: number;
}

// Response shape returned by the paginated GET /api/books endpoint.
// Includes the list of books and pagination metadata.
export interface BookResponse {
  books: Book[];
  totalNumBooks: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
}

// Represents a book and its quantity in the shopping cart.
export interface CartItem {
  book: Book;
  quantity: number;
}
