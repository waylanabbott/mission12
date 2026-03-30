import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// Navigation bar displayed at the top of every page.
// Shows links to the book list, admin page, and the shopping cart
// with a badge showing the number of items and total price.
function Header() {
  // Get cart totals from the cart context
  const { totalItems, totalPrice } = useCart();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        {/* Site brand/title - links back to the home page */}
        <Link className="navbar-brand" to="/">
          Online Bookstore
        </Link>

        {/* Main navigation links */}
        <div className="navbar-nav me-auto">
          <Link className="nav-link" to="/">
            Books
          </Link>
          <Link className="nav-link" to="/adminbooks">
            Admin
          </Link>
        </div>

        {/* Cart button with Bootstrap badge showing item count and total */}
        <Link to="/cart" className="btn btn-outline-light position-relative">
          Cart
          {/* Only show the badge and price when there are items in the cart */}
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
