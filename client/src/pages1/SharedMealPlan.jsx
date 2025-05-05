import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Calendar, Clock, ChefHat } from "lucide-react";

const SharedMealPlan = () => {
  const { shareId } = useParams();
  const [mealPlan, setMealPlan] = useState(null);

  console.log("shareId:", shareId);

  useEffect(() => {
    const fetchMealPlan = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5001/meal-plans/shared/${shareId}`
        );
        setMealPlan(data);
      } catch (error) {
        console.error("Error fetching shared meal plan", error);
      }
    };
    fetchMealPlan();
  }, [shareId]);

  console.log("mealPlan:", mealPlan);
  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-indigo-700">
          Shared Meal Plan
        </h2>
        {mealPlan ? (
          <div className="space-y-6">
            {Object.entries(mealPlan.plan).map(([date, meals]) => (
              <div key={date} className="bg-indigo-50 p-4 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold text-indigo-900 mb-4">
                  {formatDate(date)}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {["breakfast", "lunch", "dinner", "snack"].map((type) => (
                    <div
                      key={type}
                      className="bg-white p-3 rounded-lg border border-indigo-200 shadow-sm text-center"
                    >
                      <p className="text-sm font-medium text-gray-600 capitalize">
                        {type}
                      </p>
                      <p className="text-indigo-800 font-semibold mt-1">
                        {meals[type]?.title || "No Meal Selected"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">Loading meal plan...</p>
        )}
      </div>
    </div>
  );
};

export default SharedMealPlan;
