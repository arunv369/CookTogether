import React from "react";
import { Search, Calendar, Users, Heart } from "lucide-react";

const features = [
  {
    icon: <Search className="h-8 w-8 text-primary-600" />,
    title: "Ingredient-Based Discovery",
    description:
      "Find recipes based on ingredients you already have in your kitchen, reducing food waste and shopping trips.",
  },
  {
    icon: <Calendar className="h-8 w-8 text-primary-600" />,
    title: "Smart Meal Planning",
    description:
      "Plan your meals for the week, generate shopping lists automatically, and stay organized.",
  },
  {
    icon: <Users className="h-8 w-8 text-primary-600" />,
    title: "Vibrant Community",
    description:
      "Connect with other food enthusiasts, share your creations, and discover inspiration.",
  },
  {
    icon: <Heart className="h-8 w-8 text-primary-600" />,
    title: "Personalized Experience",
    description:
      "Save your favorite recipes, create collections, and customize your profile to reflect your culinary style.",
  },
];

const FeatureSection = () => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-gray-900">
            Cooking Made Simple
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Our platform makes every step of your cooking journey easier, from
            finding recipes to planning meals and connecting with others.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow duration-300"
            >
              <div className="rounded-full w-12 h-12 flex items-center justify-center bg-primary-100 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
