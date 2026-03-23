import { useState, useEffect } from 'react';

// Props for controlling which category is selected
interface CategoryFilterProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

// Sidebar component that displays book categories using Bootstrap List Group
// Fetches categories from the API and highlights the active selection
function CategoryFilter({
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  const [categories, setCategories] = useState<string[]>([]);

  // Fetch distinct categories from the API on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/books/categories');
        if (response.ok) {
          const data: string[] = await response.json();
          setCategories(data);
        }
      } catch {
        // Silently fail - categories sidebar just won't display
      }
    };

    fetchCategories();
  }, []);

  return (
    <div>
      <h5 className="mb-3">Categories</h5>

      {/* Bootstrap List Group for category selection */}
      <div className="list-group">
        {/* "All Categories" option to clear the filter */}
        <button
          className={`list-group-item list-group-item-action ${
            selectedCategory === null ? 'active' : ''
          }`}
          onClick={() => onSelectCategory(null)}
        >
          All Categories
        </button>

        {/* Individual category buttons */}
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
