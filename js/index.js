const dataLocation = "~/../public/data/recipes.json";
const recipeSection = document.getElementById("results-section");

function filterFunction(param) {
  let input = document.getElementById("myInput");
  let filter = input.value.toUpperCase();
  let filterSelection = document.querySelectorAll(".selection-" + param);
  console.log(filterSelection);
  for (let i = 0; i < filterSelection.length; i++) {
    input.value =
      filterSelection[i].textContent || filterSelection[i].innerText;
    if (input.value.toUpperCase().indexOf(filter) > -1) {
      filterSelection[i].style.display =
        "filters--dropdown--selection selection-" + param;
    } else {
      filterSelection[i].style.display = "filters--dropdown--selection--hidden";
    }
  }
}

// Fonction permettant d'afficher les options des filtres
function displayOptions(param) {
  let filterSelection = document.querySelectorAll(".selection-" + param);
  console.log(filterSelection);
  for (let i = 0; i < filterSelection.length; i++) {
    filterSelection[i].className =
      "filters--dropdown--selection selection-" + param;
  }
}

// Fonction permettant de cacher les options des filtres
function hideOptions(param) {
  let filterSelection = document.querySelectorAll(".selection-" + param);
  console.log(filterSelection);
  for (let i = 0; i < filterSelection.length; i++) {
    filterSelection[i].className =
      "filters--dropdown--selection--hidden selection-" + param;
  }
}

// Récupération des données des recettes
fetch(dataLocation)
  .then((response) => response.json())
  .then(function getRecipeInfo(data) {
    console.log(data);
    for (const object of data) {
      const recipe = RecipeFactory.makeRecipe(
        object.id,
        object.name,
        object.servings,
        object.ingredients,
        object.time,
        object.description,
        object.appliance,
        object.ustensils
      ); // Création de l'objet Recette en utilisant la fonction de la factory

      // Bloc créé pour chaque recette
      recipeSection.innerHTML += createHTMLCode(recipe); // Fonction cherchée dans le fichier helpers.js pour créer le code HTML pour chaque photographe du site

      const articleIngredients = document.getElementById(
        "ingredients-" + recipe.id
      );
      for (ingredient of recipe.ingredients) {
        textValue = "";
        if (ingredient.ingredient && ingredient.quantity && ingredient.unit)
          textValue =
            "<b>" +
            ingredient.ingredient +
            ":</b>" +
            " " +
            ingredient.quantity +
            " " +
            ingredient.unit;
        if (ingredient.ingredient && ingredient.quantity && !ingredient.unit) {
          textValue =
            "<b>" + ingredient.ingredient + ":</b>" + " " + ingredient.quantity;
        }
        if (ingredient.ingredient && !ingredient.quantity) {
          textValue = "<b>" + ingredient.ingredient + ":</b>";
        }
        articleIngredients.innerHTML += `
        <p id="${ingredient}-${recipe.id}" class="recipe--ingredients-description--ingredients--text">${textValue}</p>
        `;
      }
    }
  });
