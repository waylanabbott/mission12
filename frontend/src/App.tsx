import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import BookList from './components/BookList';
import CartPage from './components/CartPage';

function App() {
  return (
    <CartProvider>
      <Header />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<BookList />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </div>
    </CartProvider>
  );
}

export default App;
