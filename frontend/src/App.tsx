import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import BookList from './components/BookList';
import CartPage from './components/CartPage';
import AdminBooks from './components/AdminBooks';

// Root application component.
// Wraps everything in CartProvider so all pages can access the shopping cart.
// Defines the routes for the book list, cart, and admin pages.
function App() {
  return (
    <CartProvider>
      {/* Navigation bar shown on every page */}
      <Header />

      {/* Main content area with Bootstrap container */}
      <div className="container mt-4">
        <Routes>
          {/* Home page - displays books with filtering and pagination */}
          <Route path="/" element={<BookList />} />

          {/* Shopping cart page */}
          <Route path="/cart" element={<CartPage />} />

          {/* Admin page for adding, editing, and deleting books */}
          <Route path="/adminbooks" element={<AdminBooks />} />
        </Routes>
      </div>
    </CartProvider>
  );
}

export default App;
