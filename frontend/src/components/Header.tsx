import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// Navigation bar displayed at the top of every page
// Uses Bootstrap Badge (rounded-pill) to show cart item count
function Header() {
  const { totalItems, totalPrice } = useCart();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        {/* Site brand/title linking to home page */}
        <Link className="navbar-brand" to="/">
          Online Bookstore
        </Link>

        {/* Cart button with Bootstrap Badge showing item count and total */}
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
