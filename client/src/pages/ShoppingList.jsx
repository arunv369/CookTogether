import { useEffect, useState } from "react";

const ShoppingList = () => {
  const [shoppingItems, setShoppingItems] = useState({});

  useEffect(() => {
    const plan = JSON.parse(localStorage.getItem("meal-plan")) || {};
    const ingredientMap = {};

    Object.values(plan).forEach((recipes) => {
      recipes.forEach((recipe) => {
        recipe.ingredients.forEach((item) => {
          const name = item.toLowerCase();
          if (ingredientMap[name]) {
            ingredientMap[name] += 1;
          } else {
            ingredientMap[name] = 1;
          }
        });
      });
    });

    setShoppingItems(ingredientMap);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">🛒 Shopping List</h2>
        <button
          onClick={handlePrint}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Print List
        </button>
      </div>

      {Object.keys(shoppingItems).length === 0 ? (
        <p className="text-gray-600 text-center">
          No items found. Plan some meals first!
        </p>
      ) : (
        <ul className="bg-white shadow rounded p-4 space-y-2">
          {Object.entries(shoppingItems).map(([item, qty]) => (
            <li
              key={item}
              className="flex justify-between border-b pb-1 last:border-none"
            >
              <span>{item}</span>
              <span className="text-gray-600">x{qty}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ShoppingList;
