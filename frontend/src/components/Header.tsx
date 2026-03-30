import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// Navigation bar displayed at the top of every page
function Header() {
  const { totalItems, totalPrice } = useCart();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        {/* Site brand/title linking to home page */}
        <Link className="navbar-brand" to="/">
          Online Bookstore
        </Link>

        {/* Navigation links */}
        <div className="navbar-nav me-auto">
          <Link className="nav-link" to="/">
            Books
          </Link>
          <Link className="nav-link" to="/adminbooks">
            Admin
          </Link>
        </div>

        {/* Cart button with item count and total */}
        <Link to="/cart" className="btn btn-outline-light position-relative">
          Cart
          {totalItems > 0 && (
            <span className="badge bg-danger rounded-pill ms-2">
              {totalItems}
            </span>
          )}
          {totalItems > 0 && (
            <span className="ms-2">${totalPrice.toFixed(2)}</span>
          )}
        </Link>
      </div>
    </nav>
  );
}

export default Header;
