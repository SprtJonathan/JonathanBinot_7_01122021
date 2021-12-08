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
      // On filtre le tableau contenant la liste des recettes
      (recipeList) =>
        recipeList.name // Pour les noms de recettes, on cherche lesquels correspondent au mot entré dans la barre de recherche
          .toLowerCase() // Transformation de tous les caractères en minuscule
          .normalize("NFD") // Normalisation des caractères (Normalization Form Canonical Decomposition)
          .replace(/[\u0300-\u036f]/g, "") // Remplacement des accents par les lettres sans accents de manière à éviter les fautes
          .includes(
            searchValue
              .toLowerCase() // Même démarche pour le texte entré dans le champ de recherche
              .normalize("NFD") // Afin de faire correspondre les mots et de trouver plus facilement les recettes voulues
              .replace(/[\u0300-\u036f]/g, "")
          ) ||
        recipeList.description // Pour les recettes
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .includes(
            searchValue
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
          ) ||
        recipeList.ustensils // Pour les noms des ustensiles
          .map((ustensils) =>
            ustensils
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
          )
          .includes(
            searchValue
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
          ) ||
        recipeList.ingredients // Pour les noms des ingrédients
          .map((ingredients) =>
            ingredients.ingredient
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
          )
          .includes(
            searchValue
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
          )
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
