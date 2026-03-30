import { useState, useEffect } from 'react';
import { API_BASE } from '../api';

// Props interface for the CategoryFilter component
interface CategoryFilterProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

// Sidebar component that displays a list of book categories.
// Uses Bootstrap List Group to show clickable category buttons.
// The active category is highlighted, and clicking "All Categories" clears the filter.
function CategoryFilter({
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  // State to hold the list of categories from the API
  const [categories, setCategories] = useState<string[]>([]);

  // Fetch the distinct categories from the backend when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/books/categories`);
        if (response.ok) {
          const data: string[] = await response.json();
          setCategories(data);
        }
      } catch {
        // If the fetch fails, the sidebar just won't show categories
      }
    };

    fetchCategories();
  }, []);

  return (
    <div>
      <h5 className="mb-3">Categories</h5>

      {/* Bootstrap List Group for category buttons */}
      <div className="list-group">
        {/* "All Categories" option - clears the active filter */}
        <button
          className={`list-group-item list-group-item-action ${
            selectedCategory === null ? 'active' : ''
          }`}
          onClick={() => onSelectCategory(null)}
        >
          All Categories
        </button>

        {/* Render a button for each category from the API */}
        {categories.map((cat) => (
          <button
            key={cat}
            className={`list-group-item list-group-item-action ${
              selectedCategory === cat ? 'active' : ''
            }`}
            onClick={() => onSelectCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategoryFilter;
