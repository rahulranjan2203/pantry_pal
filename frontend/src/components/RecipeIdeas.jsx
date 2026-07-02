import React, { useState, useEffect } from 'react';
import { ChefHat, Clock, Users } from 'lucide-react';

const RecipeIdeas = ({ ingredients }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecipes = async () => {
      if (!ingredients || ingredients.length === 0) {
        setRecipes([]);
        return;
      }

      setLoading(true);
      setError('');

      try {
        // Join multiple ingredients with comma for API call
        const ingredientString = ingredients.join(',');
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredientString}`);
        const data = await response.json();

        if (data.meals) {
          // Limit to top 6 recipes
          setRecipes(data.meals.slice(0, 6));
        } else {
          setRecipes([]);
        }
      } catch (err) {
        setError('Failed to fetch recipes');
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [ingredients]);

  if (!ingredients || ingredients.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-xl">
        <div className="text-center">
          <ChefHat className="w-16 h-16 text-teal-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Recipe Suggestions</h3>
          <p className="text-teal-200">Select items above to see recipe ideas!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <ChefHat className="w-6 h-6 text-teal-400" />
        <div>
          <h3 className="text-xl font-bold text-white">
            Recipe Ideas with {ingredients.length === 1 ? ingredients[0] : `${ingredients.length} ingredients`}
          </h3>
          {ingredients.length > 1 && (
            <p className="text-sm text-teal-200 mt-1">
              Using: {ingredients.join(', ')}
            </p>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-400">{error}</p>
        </div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-teal-200">No recipes found for this ingredient.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div
              key={recipe.idMeal}
              className="group bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-white/15 hover:shadow-lg transition-all duration-300 cursor-pointer border border-white/20"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={recipe.strMealThumb}
                  alt={recipe.strMeal}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-white text-sm leading-tight line-clamp-2">
                  {recipe.strMeal}
                </h4>
                <div className="flex items-center gap-4 mt-3 text-xs text-teal-200">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>30 min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>4 servings</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipeIdeas;