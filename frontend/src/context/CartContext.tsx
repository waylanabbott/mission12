import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Book, CartItem } from '../types/Book';

// Define the shape of the cart context so components know what's available
interface CartContextType {
  items: CartItem[];
  addToCart: (book: Book) => void;
  removeFromCart: (bookID: number) => void;
  updateQuantity: (bookID: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

// Create the context with undefined as the default value
const CartContext = createContext<CartContextType | undefined>(undefined);

// CartProvider wraps the app and provides cart state to all child components.
// The cart is persisted in sessionStorage so it survives page navigation.
export function CartProvider({ children }: { children: ReactNode }) {
  // Initialize cart items from sessionStorage on first load.
  // If there's saved cart data, parse it; otherwise start with an empty array.
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = sessionStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Save the cart to sessionStorage whenever the items change.
  // This ensures the cart persists as the user navigates between pages.
  useEffect(() => {
    sessionStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  // Add a book to the cart.
  // If the book is already in the cart, increment its quantity by 1.
  // Otherwise, add it as a new item with quantity 1.
  const addToCart = (book: Book) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.book.bookID === book.bookID);
      if (existing) {
        // Book already in cart - increase quantity
        return prev.map((item) =>
          item.book.bookID === book.bookID
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // New book - add to cart with quantity 1
      return [...prev, { book, quantity: 1 }];
    });
  };

  // Remove a book entirely from the cart by filtering it out
  const removeFromCart = (bookID: number) => {
    setItems((prev) => prev.filter((item) => item.book.bookID !== bookID));
  };

  // Update the quantity of a specific book in the cart.
  // If the new quantity is 0 or less, remove the book instead.
  const updateQuantity = (bookID: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookID);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.book.bookID === bookID ? { ...item, quantity } : item
      )
    );
  };

  // Clear all items from the cart
  const clearCart = () => setItems([]);

  // Calculate the total number of items (sum of all quantities)
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Calculate the total price (sum of price * quantity for each item)
  const totalPrice = items.reduce(
    (sum, item) => sum + item.book.price * item.quantity,
    0
  );

  // Provide the cart state and functions to all child components
  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Custom hook for accessing the cart context.
// Must be used inside a CartProvider or it will throw an error.
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
