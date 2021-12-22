const dataLocation = "~/../public/data/recipes.json";
const recipeSection = document.getElementById("results-section");
const searchBar = document.getElementById("searchbar");

let recipeList = [];
let filterDropdownSelect;
let globalFilterTab = []; // Tableau servant à contenir les filtres sélectionnés

fetchData();

function filterFunction(param) {}

// Fonction permettant d'afficher les options des filtres
function displayOptions(param) {
  hideOptions("ingredient");
  hideOptions("device");
  hideOptions("utensil");
  let dropdownDiv = document.getElementById("div-dropdown-" + param);
  dropdownDiv.style.display = "flex";

  let hideButton = document.getElementById("hide-" + param);
  hideButton.innerHTML = `<i class="bi bi-chevron-up"></i>`;
  hideButton.removeAttribute("onclick");
  hideButton.setAttribute("onclick", "hideOptions('" + param + "')");

  let dropdownInputDiv = document.getElementById(param + "-searchbar");
  dropdownInputDiv.className = "filters--input--expanded background--" + param;
}

// Fonction permettant de cacher les options des filtres
function hideOptions(param) {
  let dropdownDiv = document.getElementById("div-dropdown-" + param);
  dropdownDiv.style.display = "none";

  let hideButton = document.getElementById("hide-" + param);
  hideButton.innerHTML = `<i class="bi bi-chevron-down"></i>`;
  hideButton.removeAttribute("onclick");
  hideButton.setAttribute("onclick", "displayOptions('" + param + "')");

  let dropdownInputDiv = document.getElementById(param + "-searchbar");
  dropdownInputDiv.className = "filters--input background--" + param;
}

// Récupération des données des recettes
function fetchData() {
  showIngredients();
  showDevices();
  showUtensils();
  fetch(dataLocation)
    .then((response) => response.json())
    .then(function getRecipeInfo(data) {
      recipeList = [];
      //console.log(data);
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
  searchRecipe(searchBar.value, globalFilterTab);
}); // Lorsqu'un mot est écrit dans la barre de recherche, on déclenche la fonction de recherche en passant en paramètre la valeur de la recherche

document
  .getElementById("searchbar-button")
  .addEventListener("click", searchRecipe(searchBar.value, globalFilterTab));

///////////////////////////////////////////////////////
//// Fonction permettant d'effectuer une recherche ////
///////////////////////////////////////////////////////

function searchRecipe(searchValue, tagsArray) {
  // console.log("Recherche : " + searchValue + " " + tagsArray); // Mot recherché
  let searchResults = []; // Tableau contenant les résultats de la recherche

  let searchTags = [];

  searchTags[0] = { name: searchValue, type: "searchbar" };

  for (i = 1; i <= tagsArray.length; i++) {
    // On ajoute les tags dans le tableau de recherche
    let sameValue = false; // Booléen permettant de ne pas avoir de doublons dans le tableau des tags de recherche
    if (searchTags[0] !== undefined) {
      // Si la valeur initiale du tableau n'est pas non définie
      if (
        // On vérifie qu'elle ne soit pas égale à un des membres du tableau
        normalizeString(searchTags[0].name) !=
        normalizeString(tagsArray[i - 1].name)
      ) {
        sameValue = false; // Si aucune valeure n'apparaît en double, alors on renvoie faux
      } else {
        sameValue = true; // Sinon on renvoie vrai
      }
    }
    if (!sameValue) {
      // Si aucune valeur n'apparaît deux fois
      searchTags.push(tagsArray[i - 1]); // On ajoute les valeurs du tableau de filtres dans le tableau des tags de recherche
    }
  }

  console.log(searchTags);

  // Si la valeur du champ de recherche n'est pas vide
  if (searchTags !== "") {
    let searchbarResults = recipeList.filter(
      // On filtre le tableau contenant la liste des recettes
      (recipeList) =>
        verifyTag(recipeList.name, searchValue) || // Pour les noms de recettes, on cherche lesquels correspondent au mot entré dans la barre de recherche
        verifyTag(recipeList.description, searchValue) || // Pour les recettes
        recipeList.ustensils // Pour les noms des ustensiles
          .map((ustensils) => normalizeString(ustensils))
          .includes(normalizeString(searchValue)) ||
        recipeList.ingredients // Pour les noms des ingrédients
          .map((ingredients) => normalizeString(ingredients.ingredient))
          .includes(normalizeString(searchValue))
    );

    let = selectedIngredientsArray = [];
    for (i = 1; i < searchTags.length; i++) {
      if (searchTags[i].type == "ingredient") {
        selectedIngredientsArray.push(searchTags[i].name);
      }
    }

    console.log(selectedIngredientsArray);

    let ingredientFilterResults = recipeList.filter((recipeList) => {
      console.log(
        selectedIngredientsArray.includes(recipeList.ingredients.ingredient)
      );
      return (
        selectedIngredientsArray.indexOf(recipeList.ingredients.ingredient) !==
        -1
      );
    });

    console.log(ingredientFilterResults);

    if (searchbarResults.length == 0) {
      // Si aucun objet n'est ajouté au tableau / Aucun résultat ne resort, alors on affiche le message
      recipeSection.innerHTML = `Aucun résultat trouvé pour "${searchValue}"`;
    } else {
      displayRecipes(searchbarResults, searchResults);
    }
    console.log(searchbarResults);
  } else {
    fetchData();
  }
}

//////////////////////////////////////////////////////
////// Fonctions permettant d'afficher les tags //////
//////////////////////////////////////////////////////

// Fonction permettant d'afficher tous les ingrédients dans la liste des tags en les récupérant dynamiquement dans le JSON
function showIngredients() {
  let divIngredients = document.getElementById("div-dropdown-ingredient");
  let ingredientsTab = [];
  divIngredients.innerHTML = "";
  fetch(dataLocation)
    .then((response) => response.json())
    .then(function addToArray(data) {
      for (let j = 0; j < data.length; j++) {
        for (let i = 0; i < data[j].ingredients.length; i++) {
          if (
            !ingredientsTab.includes(
              data[j].ingredients[i].ingredient.toLowerCase()
            ) &&
            data[j].ingredients[i].ingredient
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .includes(
                searchBarIngredients.value
                  .toLowerCase()
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
              )
          ) {
            ingredientsTab.push(
              data[j].ingredients[i].ingredient.toLowerCase()
            );
          }
        }
      }
      // Création d'un bloc HTML pour chaque élément du tableau
      for (let i = 0; i < ingredientsTab.length; i++) {
        divIngredients.innerHTML += `<span id="ingredient-id-${i}" class="filters--dropdown--element select-ingredient">${ingredientsTab[i]}</span>`;
      }
      //console.log(ingredientsTab);

      filterDropdownSelect = document.querySelectorAll(".select-ingredient");
      //console.log(filterDropdownSelect);
      filterDropdownSelect.forEach((el) =>
        el.addEventListener("click", (event) => {
          filterSearch(event, "ingredient");
        })
      );
    });
}

// Fonction permettant d'afficher tous les appareils dans la liste des tags en les récupérant dynamiquement dans le JSON
function showDevices() {
  let divDevices = document.getElementById("div-dropdown-device");
  let devicesTab = [];
  divDevices.innerHTML = "";
  fetch(dataLocation)
    .then((response) => response.json())
    .then(function addToArray(data) {
      for (let j = 0; j < data.length; j++) {
        if (
          !devicesTab.includes(data[j].appliance.toLowerCase()) &&
          data[j].appliance
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .includes(
              searchBarDevices.value
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
            )
        ) {
          devicesTab.push(data[j].appliance.toLowerCase());
        }
      }
      // Création d'un bloc HTML pour chaque élément du tableau
      for (let i = 0; i < devicesTab.length; i++) {
        divDevices.innerHTML += `<span id="device-id-${i}" class="filters--dropdown--element select-device">${devicesTab[i]}</span>`;
      }

      filterDropdownSelect = document.querySelectorAll(".select-device");
      //console.log(filterDropdownSelect);
      filterDropdownSelect.forEach((el) =>
        el.addEventListener("click", (event) => {
          filterSearch(event, "device");
        })
      );
    });
}

// Fonction permettant d'afficher tous les ustensiles dans la liste des tags en les récupérant dynamiquement dans le JSON
function showUtensils() {
  let divUtensils = document.getElementById("div-dropdown-utensil");
  let utensilsTab = [];
  divUtensils.innerHTML = "";
  fetch(dataLocation)
    .then((response) => response.json())
    .then(function addToArray(data) {
      for (let j = 0; j < data.length; j++) {
        for (let i = 0; i < data[j].ustensils.length; i++) {
          if (
            !utensilsTab.includes(data[j].ustensils[i].toLowerCase()) &&
            data[j].ustensils[i]
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .includes(
                searchBarUtensils.value
                  .toLowerCase()
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
              )
          ) {
            utensilsTab.push(data[j].ustensils[i].toLowerCase());
          }
        }
      }
      // Création d'un bloc HTML pour chaque élément du tableau
      for (let i = 0; i < utensilsTab.length; i++) {
        divUtensils.innerHTML += `<span id="utensil-id-${i}" class="filters--dropdown--element select-utensil">${utensilsTab[i]}</span>`;
      }
      filterDropdownSelect = document.querySelectorAll(".select-utensil");
      //console.log(filterDropdownSelect);
      filterDropdownSelect.forEach((el) =>
        el.addEventListener("click", (event) => {
          filterSearch(event, "utensil");
        })
      );
    });
}

//////////////////////////////////////////////////////////
// Fonction permettant de filtrer les recettes par tags //
//////////////////////////////////////////////////////////

// Fonction permettant de filtrer les recettes par tags
function filterSearch(filter, type) {
  if (filter.target.id.includes(type + "-id-")) {
    let filterSearchBar = document.getElementById(type + "-searchbar");
    filterSearchBar.value = "";
    console.log(globalFilterTab);
    let tagToInsert = { name: filter.target.innerText, type: type };
    let chosenFilters = document.getElementById("chosen-filters");
    let alreadySelected = false;
    for (i = 0; i < globalFilterTab.length; i++) {
      alreadySelected += globalFilterTab[i].name.includes(tagToInsert.name); // Si un des membres du tableau contient déjà le tag à ajouter, alors on ne l'ajoute pas
    }
    if (!alreadySelected) {
      globalFilterTab.push(tagToInsert);
      //console.log(globalFilterTab);
      createFiltersHTMLCode(globalFilterTab, chosenFilters, type);
    }
    if (globalFilterTab.length > 0) {
      chosenFilters.style.display = "flex";
    } else {
      chosenFilters.style.display = "none";
    }
    searchRecipe(searchBar.value, globalFilterTab);
  }
}

// Fonction permettant de retirer un tag de la sélection
function removeFilter(value, type) {
  let index = globalFilterTab.indexOf([value, type]);
  globalFilterTab.splice(index, 1);
  let chosenFilters = document.getElementById("chosen-filters");
  createFiltersHTMLCode(globalFilterTab, chosenFilters, type);
  searchRecipe(searchBar.value, globalFilterTab);
}

let searchBarIngredients = document.getElementById("ingredient-searchbar"); // Barre de recherche
let searchBarDevices = document.getElementById("device-searchbar");
let searchBarUtensils = document.getElementById("utensil-searchbar");
searchBarIngredients.addEventListener("keydown", showIngredients);
searchBarDevices.addEventListener("keydown", showDevices);
searchBarUtensils.addEventListener("keydown", showUtensils);
