const dataLocation = "~/../public/data/recipes.json";
const recipeSection = document.getElementById("results-section");
const searchBar = document.getElementById("searchbar");

let recipeList = [];

fetchData();

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
function fetchData() {
  fetch(dataLocation)
    .then((response) => response.json())
    .then(function getRecipeInfo(data) {
      recipeList = [];
      console.log(data);
      displayRecipes(data, recipeList);
    });
}

function displayRecipes(data, reciepeArray) {
  recipeSection.innerHTML = "";
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
    displayIngredients(recipe);
    reciepeArray.push(object);
  }
}

searchBar.addEventListener("change", (event) => {
  searchRecipe(searchBar.value);
}); // Lorsqu'un mot est écrit dans la barre de recherche, on déclenche la fonction de recherche en passant en paramètre la valeur de la recherche

// Fonction permettant d'effectuer une recherche
function searchRecipe(searchValue) {
  console.log("Recherche : " + searchValue); // Mot recherché
  // console.log(recipeList); // Tableau contenant les recettes
  let searchResults = []; // Tableau contenant les résultats de la recherche
  // Si la valeur du champ de recherche est du texte
  if (searchValue !== "") {
    let searchData = recipeList.filter(
      (recipeList) =>
        recipeList.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        recipeList.description
          .toLowerCase()
          .includes(searchValue.toLowerCase()) ||
        recipeList.ustensils
          .map((ustensils) => ustensils.toLowerCase())
          .includes(searchValue.toLowerCase()) ||
        recipeList.ingredients
          .map((ingredients) => ingredients.ingredient.toLowerCase())
          .includes(searchValue.toLowerCase())
    );
    if (searchData.length == 0) {
      recipeSection.innerHTML = `Aucun résultat trouvé pour "${searchValue}"`;
    } else {
      displayRecipes(searchData, searchResults);
    }
    console.log(searchData);
  } else {
    fetchData();
  }
}
