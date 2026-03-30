import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import BookList from './components/BookList';
import CartPage from './components/CartPage';
import AdminBooks from './components/AdminBooks';

// Root application component with routing and cart state
function App() {
  return (
    <CartProvider>
      {/* Navigation bar with cart badge */}
      <Header />

      {/* Main content area */}
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<BookList />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/adminbooks" element={<AdminBooks />} />
        </Routes>
      </div>
    </CartProvider>
  );
}

export default App;
