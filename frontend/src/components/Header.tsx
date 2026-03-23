import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Header() {
  const { totalItems, totalPrice } = useCart();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Online Bookstore
        </Link>
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
