import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();
  const navigate = useNavigate();

  const handleContinueShopping = () => {
    navigate('/');
  };

  if (items.length === 0) {
    return (
      <div className="text-center mt-5">
        <h2>Your Cart is Empty</h2>
        <p className="text-muted">Browse our books and add some to your cart!</p>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/')}
        >
          Browse Books
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">Shopping Cart</h2>

      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Title</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.book.bookID}>
                <td>{item.book.title}</td>
                <td>${item.book.price.toFixed(2)}</td>
                <td style={{ width: '150px' }}>
                  <div className="d-flex align-items-center">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() =>
                        updateQuantity(item.book.bookID, item.quantity - 1)
                      }
                    >
                      -
                    </button>
                    <span className="mx-3">{item.quantity}</span>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() =>
                        updateQuantity(item.book.bookID, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                </td>
                <td>${(item.book.price * item.quantity).toFixed(2)}</td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => removeFromCart(item.book.bookID)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="text-end fw-bold">
                Total:
              </td>
              <td className="fw-bold">${totalPrice.toFixed(2)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="d-flex justify-content-between mt-3">
        <button
          className="btn btn-secondary"
          onClick={handleContinueShopping}
        >
          Continue Shopping
        </button>
        <button className="btn btn-primary">Checkout</button>
      </div>
    </div>
  );
}

export default CartPage;
