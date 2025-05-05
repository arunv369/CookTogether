import React, { useEffect, useState } from "react";
import {
  Plus,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Share2,
  Download,
  ShoppingCart,
  Check,
  X,
  ChevronDown,
  Clock,
  Users,
  ChefHat,
  Heart,
  BookmarkPlus,
  MessageSquare,
  Send,
  Star,
  Search,
  Copy,
  Link,
} from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const MealPlanningPage = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [weekPlan, setWeekPlan] = useState({});
  const [showRecipeSelector, setShowRecipeSelector] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedMealType, setSelectedMealType] = useState("breakfast");
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [shoppingList, setShoppingList] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  const { recipes } = useAuth();
  console.log("shoppingList:", shoppingList);

  const [recipesMap, setRecipesMap] = useState({}); // ID -> recipe object

  useEffect(() => {
    const fetchMealPlan = async () => {
      try {
        const res = await axios.get(
          "https://cooktogether.onrender.com/meal-plans",
          {
            params: { weekStartDate: getWeekDates(currentWeek)[0] },
            withCredentials: true,
          }
        );

        const plan = res.data.plan || {};
        setWeekPlan(plan);

        // Extract unique recipe IDs from the plan
        const recipeIds = Array.from(
          new Set(
            Object.values(plan).flatMap((day) =>
              Object.values(day).filter((id) => id)
            )
          )
        );

        if (recipeIds.length > 0) {
          const recipeRes = await axios.get(
            "https://cooktogether.onrender.com/recipes/bulk",
            {
              params: { ids: recipeIds.join(",") },
            }
          );

          const recipesMap = {};
          for (const recipe of recipeRes.data) {
            recipesMap[recipe._id] = recipe;
          }

          setRecipesMap(recipesMap); // Use this to display titles
          console.log("recipesMap:", recipesMap);
        }
      } catch (error) {
        console.error("Failed to load meal plan or recipes", error);
      }
    };

    fetchMealPlan();
  }, [currentWeek]);

  console.log("weekPlan:", weekPlan);

  const mealTypes = ["breakfast", "lunch", "dinner", "snack"];

  const getWeekDates = (date) => {
    const week = [];
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay());

    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      week.push(day.toISOString().split("T")[0]);
    }

    return week;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const handlePreviousWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() - 7);
    setCurrentWeek(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() + 7);
    setCurrentWeek(newDate);
  };

  const openRecipeSelector = (day, mealType) => {
    setSelectedDay(day);
    setSelectedMealType(mealType);
    setShowRecipeSelector(true);
  };

  const saveMealPlan = async (updatedPlan) => {
    try {
      await axios.post(
        "https://cooktogether.onrender.com/meal-plans/save",
        {
          weekStartDate: getWeekDates(currentWeek)[0], // Sunday of current week
          plan: updatedPlan,
        },
        { withCredentials: true }
      );
      // Refetch updated plan
      const res = await axios.get(
        "https://cooktogether.onrender.com/meal-plans",
        {
          params: { weekStartDate: getWeekDates(currentWeek)[0] },
          withCredentials: true,
        }
      );
      const plan = res.data.plan || {};
      setWeekPlan(plan);
    } catch (error) {
      console.error("Failed to save meal plan", error);
    }
  };

  const addRecipeToMealPlan = (recipe) => {
    const updatedPlan = {
      ...weekPlan,
      [selectedDay]: {
        ...weekPlan[selectedDay],
        [selectedMealType]: recipe,
      },
    };
    setWeekPlan(updatedPlan);
    saveMealPlan(updatedPlan);
    setShowRecipeSelector(false);
  };

  const removeRecipeFromMealPlan = (day, mealType) => {
    const updatedDay = { ...weekPlan[day], [mealType]: null };
    const updatedPlan = { ...weekPlan, [day]: updatedDay };
    setWeekPlan(updatedPlan);
    saveMealPlan(updatedPlan);
  };

  const generateShoppingList = () => {
    const ingredientMap = {};

    Object.values(weekPlan).forEach((dayPlan) => {
      Object.entries(dayPlan).forEach(([mealType, recipeId]) => {
        if (!recipeId || mealType === "_id") return;

        const recipe = recipesMap?.[recipeId];
        if (!recipe || !Array.isArray(recipe.ingredients)) return;

        if (!ingredientMap[recipe.title]) {
          ingredientMap[recipe.title] = [];
        }

        recipe.ingredients.forEach((ingredient) => {
          let name = "";
          if (typeof ingredient === "string") {
            name = ingredient.trim();
          } else if (typeof ingredient === "object" && ingredient?.name) {
            name = ingredient.name.trim();
          } else {
            console.warn("⚠️ Invalid ingredient:", ingredient);
            return;
          }

          ingredientMap[recipe.title].push({
            name,
            amount: 1,
            unit: "unit",
            checked: false,
          });
        });
      });
    });

    // Convert to group format
    return Object.entries(ingredientMap).map(([title, items]) => ({
      title,
      items,
    }));
  };

  const downloadShoppingListAsPDF = () => {
    const list = generateShoppingList();

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Shopping List", 14, 20);

    let y = 30;

    list.forEach((section) => {
      // Add recipe title
      doc.setFontSize(14);
      doc.text(section.title, 14, y);
      y += 6;

      // Extract ingredient names only
      const ingredientRows = section.items.map((item) => [item.name]);

      autoTable(doc, {
        head: [["Ingredient"]],
        body: ingredientRows,
        startY: y,
        theme: "grid",
        styles: { fontSize: 11 },
        margin: { left: 14, right: 14 },
      });

      y = doc.lastAutoTable.finalY + 10;
    });

    doc.save("shopping-list.pdf");
  };

  const handleShare = async () => {
    try {
      const { data } = await axios.post(
        "https://cooktogether.onrender.com/meal-plans/share",
        {
          weekStartDate: getWeekDates(currentWeek)[0],
        },
        { withCredentials: true }
      );

      const shareUrl = `https://cooktogether-b20.netlify.app/shared/${data.shareId}`;
      setShareUrl(shareUrl);
      setShowShareModal(true);
    } catch (err) {
      console.error("Failed to share", err);
    }
  };

  const formatDateKey = (date) => {
    const d = new Date(date);
    return d.toISOString().split("T")[0]; // "YYYY-MM-DD"
  };

  const toggleItemCheck = (groupIndex, itemIndex) => {
    setShoppingList((prev) =>
      prev.map((group, gIndex) =>
        gIndex === groupIndex
          ? {
              ...group,
              items: group.items.map((item, iIndex) =>
                iIndex === itemIndex
                  ? { ...item, checked: !item.checked }
                  : item
              ),
            }
          : group
      )
    );
  };

  const toggleGroupExpand = (recipeId) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(recipeId)) {
        next.delete(recipeId);
      } else {
        next.add(recipeId);
      }
      return next;
    });
  };

  const clearCheckedItems = () => {
    setShoppingList((prev) =>
      prev
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => !item.checked),
        }))
        .filter((group) => group.items.length > 0)
    );
  };

  const getTotalItems = () => {
    return shoppingList.reduce((total, group) => {
      if (!group.items || !Array.isArray(group.items)) return total;
      return total + group.items.length;
    }, 0);
  };

  const getRemainingItems = () => {
    return shoppingList.reduce((total, group) => {
      if (!group.items || !Array.isArray(group.items)) return total;
      return total + group.items.filter((item) => !item.checked).length;
    }, 0);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-serif font-bold text-gray-900">
          Meal Planning
        </h1>
        <div className="flex gap-4">
          <button
            onClick={handleShare}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-primary-600 bg-white rounded-md shadow-sm"
          >
            <Share2 className="h-5 w-5 mr-2" />
            Share Plan
          </button>
          <button
            className="flex items-center px-4 py-2 text-white bg-primary-600 hover:bg-primary-700 rounded-md shadow-sm"
            onClick={() => {
              const list = generateShoppingList();
              setShoppingList(list);
              setShowShoppingList(true);
            }}
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Shopping List
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <button
            onClick={handlePreviousWeek}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="font-medium">
            {formatDate(getWeekDates(currentWeek)[0])} -{" "}
            {formatDate(getWeekDates(currentWeek)[6])}
          </span>
          <button
            onClick={handleNextWeek}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                  Meal Type
                </th>
                {getWeekDates(currentWeek).map((date) => (
                  <th
                    key={date}
                    className="py-3 px-4 text-center text-sm font-medium text-gray-500"
                  >
                    {formatDate(date)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mealTypes.map((mealType) => (
                <tr key={mealType} className="border-t border-gray-200">
                  <td className="py-4 px-4 text-sm font-medium text-gray-900 capitalize">
                    {mealType}
                  </td>
                  {getWeekDates(currentWeek).map((date) => {
                    const dateKey = formatDateKey(date);
                    const mealId = weekPlan[dateKey]?.[mealType];
                    const recipe = recipesMap[mealId];
                    //const recipe = weekPlan[date]?.[mealType];

                    return (
                      <td key={date} className="py-4 px-4">
                        {recipe ? (
                          <div className="relative group">
                            <div className="text-sm font-medium text-gray-900">
                              {recipe.title}
                            </div>
                            <button
                              onClick={() =>
                                removeRecipeFromMealPlan(date, mealType)
                              }
                              className="absolute top-0 right-0 hidden group-hover:block p-1 text-gray-400 hover:text-gray-600"
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => openRecipeSelector(date, mealType)}
                            className="w-full py-2 px-3 text-sm text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-md flex items-center justify-center"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-auto sm:mx-4">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Share Meal Plan
                </h2>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Share your meal plan with friends and family using this link:
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="flex-1 bg-gray-50 p-3 rounded-lg border border-gray-200 overflow-x-auto">
                    <div className="flex items-center">
                      <Link className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600 break-all">
                        {shareUrl}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className={`px-4 py-2 rounded-md transition-colors flex-shrink-0 ${
                      showCopySuccess
                        ? "bg-green-100 text-green-700"
                        : "bg-primary-600 text-white hover:bg-primary-700"
                    }`}
                  >
                    {showCopySuccess ? (
                      <span className="flex items-center">
                        <Check className="h-5 w-5 mr-1" />
                        Copied!
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Copy className="h-5 w-5 mr-1" />
                        Copy
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-b-lg flex justify-end">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shopping List Modal */}
      {showShoppingList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <ShoppingCart className="h-6 w-6 mr-2 text-primary-600" />
                  Shopping List
                </h2>
                <button
                  className="flex items-center px-4 py-2 text-white bg-primary-600 hover:bg-primary-700 rounded-md shadow-sm"
                  onClick={downloadShoppingListAsPDF}
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download List
                </button>
                <button
                  onClick={() => setShowShoppingList(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  {getRemainingItems()} of {getTotalItems()} items remaining
                </p>

                {Array.isArray(shoppingList) &&
                  shoppingList.some(
                    (group) =>
                      Array.isArray(group.items) &&
                      group.items.some((item) => item.checked)
                  ) && (
                    <button
                      onClick={clearCheckedItems}
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      Clear checked items
                    </button>
                  )}
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {shoppingList.length > 0 ? (
                <div className="space-y-6">
                  {shoppingList.map((group, groupIndex) => (
                    <div
                      key={groupIndex}
                      className="bg-gray-50 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleGroupExpand(group.id)}
                        className="w-full px-4 py-3 flex items-center justify-between bg-gray-100 hover:bg-gray-200 transition-colors"
                      >
                        <span className="font-medium text-gray-900">
                          {group.title}
                        </span>
                        <ChevronDown
                          className={`h-5 w-5 text-gray-500 transition-transform ${
                            expandedGroups.has(group.id)
                              ? "transform rotate-180"
                              : ""
                          }`}
                        />
                      </button>

                      {expandedGroups.has(group.id) && (
                        <div className="p-4 space-y-2">
                          {group.items.map((item, itemIndex) => (
                            <div
                              key={itemIndex}
                              className={`flex items-start p-3 rounded-lg transition-colors ${
                                item.checked
                                  ? "bg-gray-100"
                                  : "hover:bg-gray-100"
                              }`}
                            >
                              <button
                                onClick={() =>
                                  toggleItemCheck(groupIndex, itemIndex)
                                }
                                className={`flex-shrink-0 w-6 h-6 rounded border ${
                                  item.checked
                                    ? "bg-primary-600 border-primary-600 text-white"
                                    : "border-gray-300"
                                } flex items-center justify-center mr-3`}
                              >
                                {item.checked && <Check className="h-4 w-4" />}
                              </button>
                              <div className="flex-1">
                                <p
                                  className={`font-medium ${
                                    item.checked
                                      ? "text-gray-500 line-through"
                                      : "text-gray-900"
                                  }`}
                                >
                                  {item.name}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p>No items in your shopping list</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Add some recipes to your meal plan first
                  </p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setShowShoppingList(false)}
                className="w-full py-2 px-4 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showRecipeSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-medium">
                Select Recipe for {formatDate(selectedDay)}
              </h2>
              <button
                onClick={() => setShowRecipeSelector(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              <div className="grid grid-cols-1 gap-4">
                {recipes.map((recipe) => (
                  <button
                    key={recipe._id}
                    onClick={() => addRecipeToMealPlan(recipe)}
                    className="flex items-center p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <img
                      src={`https://cooktogether.onrender.com/${recipe.image}`}
                      alt="Recipe"
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="ml-4 text-left">
                      <div className="font-medium">{recipe.title}</div>
                      <div className="text-sm text-gray-500">
                        {recipe.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealPlanningPage;
