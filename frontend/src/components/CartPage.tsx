import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// Shopping cart page that displays all items the user has added.
// Shows each item with its price, quantity controls, and subtotal.
// Includes a total at the bottom and a "Continue Shopping" button.
function CartPage() {
  // Get cart items and functions from the cart context
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();
  const navigate = useNavigate();

  // Go back to the book list page.
  // The BookList component will restore the user's previous browsing state
  // (page number, category, etc.) from sessionStorage.
  const handleContinueShopping = () => {
    navigate('/');
  };

  // If the cart is empty, show a friendly message with a link back to browsing
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

      {/* Cart items table showing title, price, quantity, and subtotal */}
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
            {/* Loop through each item in the cart */}
            {items.map((item) => (
              <tr key={item.book.bookID}>
                <td>{item.book.title}</td>
                <td>${item.book.price.toFixed(2)}</td>

                {/* Quantity controls with minus and plus buttons */}
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

                {/* Subtotal for this line item (price x quantity) */}
                <td>${(item.book.price * item.quantity).toFixed(2)}</td>

                {/* Remove button to delete this item from the cart */}
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

          {/* Footer row showing the grand total */}
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

      {/* Action buttons: continue shopping or proceed to checkout */}
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
