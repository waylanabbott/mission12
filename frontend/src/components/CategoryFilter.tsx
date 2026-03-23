import { useState, useEffect } from 'react';

interface CategoryFilterProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

function CategoryFilter({
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/books/categories');
        if (response.ok) {
          const data: string[] = await response.json();
          setCategories(data);
        }
      } catch {
        // Silently fail - categories just won't show
      }
    };

    fetchCategories();
  }, []);

  return (
    <div>
      <h5 className="mb-3">Categories</h5>
      <div className="list-group">
        <button
          className={`list-group-item list-group-item-action ${
            selectedCategory === null ? 'active' : ''
          }`}
          onClick={() => onSelectCategory(null)}
        >
          All Categories
        </button>
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
