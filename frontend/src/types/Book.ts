// Represents a single book from the API
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

// Response shape from the paginated GET /api/books endpoint
export interface BookResponse {
  books: Book[];
  totalNumBooks: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
}

// Represents a book and its quantity in the shopping cart
export interface CartItem {
  book: Book;
  quantity: number;
}
