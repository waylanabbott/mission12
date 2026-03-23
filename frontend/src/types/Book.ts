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

export interface BookResponse {
  books: Book[];
  totalNumBooks: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
}

export interface CartItem {
  book: Book;
  quantity: number;
}
