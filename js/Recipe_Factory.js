// Création de la class Recipe et de la factory
class Recipe {
  constructor(
    id,
    name,
    servings,
    ingredients,
    time,
    description,
    appliance,
    ustensils
  ) {
    this._id = id;
    this._name = name;
    this._servings = servings;
    this._ingredients = ingredients;
    this._time = time;
    this._description = description;
    this._appliance = appliance;
    this._ustensils = ustensils;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get servings() {
    return this._servings;
  }

  get ingredients() {
    return this._ingredients;
  }

  get time() {
    return this._time;
  }

  get description() {
    return this._description;
  }

  get appliance() {
    return this._appliance;
  }

  get ustensils() {
    return this._ustensils;
  }
}

const RecipeFactory = {
  makeRecipe: function (
    id,
    name,
    servings,
    ingredients,
    time,
    description,
    appliance,
    ustensils
  ) {
    return new Recipe(
      id,
      name,
      servings,
      ingredients,
      time,
      description,
      appliance,
      ustensils
    );
  },
};
