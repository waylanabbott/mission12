import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Book, CartItem } from '../types/Book';

// Shape of the cart context value
interface CartContextType {
  items: CartItem[];
  addToCart: (book: Book) => void;
  removeFromCart: (bookID: number) => void;
  updateQuantity: (bookID: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Provides cart state to all child components and persists cart in sessionStorage
export function CartProvider({ children }: { children: ReactNode }) {
  // Initialize cart from sessionStorage so it persists across page navigation
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = sessionStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync cart state to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  // Add a book to the cart, or increment quantity if already present
  const addToCart = (book: Book) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.book.bookID === book.bookID);
      if (existing) {
        return prev.map((item) =>
          item.book.bookID === book.bookID
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { book, quantity: 1 }];
    });
  };

  // Remove a book entirely from the cart
  const removeFromCart = (bookID: number) => {
    setItems((prev) => prev.filter((item) => item.book.bookID !== bookID));
  };

  // Update the quantity of a specific book; removes if quantity drops to 0
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

  // Computed totals for display in the header and cart summary
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.book.price * item.quantity,
    0
  );

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

// Custom hook for accessing the cart context from any component
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
