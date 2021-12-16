const dataLocation = "~/../public/data/recipes.json";
const recipeSection = document.getElementById("results-section");
const searchBar = document.getElementById("searchbar");

let recipeList = [];
let filterDropdownSelect;

fetchData();

function filterFunction(param) {}

// Fonction permettant d'afficher les options des filtres
function displayOptions(param) {
  hideOptions("ingredient");
  hideOptions("device");
  hideOptions("utensil");
  let dropdownDiv = document.getElementById("div-dropdown-" + param);
  dropdownDiv.style.display = "flex";

  let dropdownInputDiv = document.getElementById(param + "-searchbar");
  dropdownInputDiv.className =
    "filters--input--expanded filters--input--expanded--" + param;
}

// Fonction permettant de cacher les options des filtres
function hideOptions(param) {
  let dropdownDiv = document.getElementById("div-dropdown-" + param);
  dropdownDiv.style.display = "none";

  let dropdownInputDiv = document.getElementById(param + "-searchbar");
  dropdownInputDiv.className = "filters--input filters--input--" + param;
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
      // Si aucun objet n'est ajouté au tableau / Aucun résultat ne resort, alors on affiche le message
      recipeSection.innerHTML = `Aucun résultat trouvé pour "${searchValue}"`;
    } else {
      displayRecipes(searchData, searchResults);
    }
    console.log(searchData);
  } else {
    fetchData();
  }
}

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
      console.log(ingredientsTab);

      filterDropdownSelect = document.querySelectorAll(".select-ingredient");
      console.log(filterDropdownSelect);
      filterDropdownSelect.forEach((el) =>
        el.addEventListener("click", (event) => {
          filterSearch(event, "ingredient");
        })
      );
    });
}

let globalFilterTab = []; // Tableau servant à contenir les filtres sélectionnés
/*globalFilterTab[0] = []; // Tableau servant à contenir les filtres sélectionnés
globalFilterTab[1] = []; // Tableau servant à contenir les filtres sélectionnés
globalFilterTab[2] = []; // Tableau servant à contenir les filtres sélectionnés
*/

/*function filterSearch(filter, type) {
  if (filter.target.id.includes(type + "-id-")) {
    let filterSearchBar = document.getElementById(type + "-searchbar");
    filterSearchBar.value = "";
    let arrayNum = 0;
    if (type == "ingredient") {
      arrayNum = 0;
    }
    if (type == "device") {
      arrayNum = 1;
    }
    if (type == "utensil") {
      arrayNum = 2;
    }
    console.log(globalFilterTab.arrayNum);
    let chosenFilters = document.getElementById("chosen-filters");
    if (!globalFilterTab[arrayNum].includes(filter.target.innerText)) {
      globalFilterTab[arrayNum].push(filter.target.innerText);
      console.log(globalFilterTab[arrayNum]);
      createFiltersHTMLCode(globalFilterTab, chosenFilters, type);
    }
    if (globalFilterTab.length > 0) {
      chosenFilters.style.display = "flex";
    } else {
      chosenFilters.style.display = "none";
    }
    searchRecipe(filter.target.innerText);
  }
}*/

function filterSearch(filter, type) {
  if (filter.target.id.includes(type + "-id-")) {
    let filterSearchBar = document.getElementById(type + "-searchbar");
    filterSearchBar.value = "";
    let chosenFilters = document.getElementById("chosen-filters");
    if (
      !globalFilterTab.includes(filtersHTMLCode(filter.target.innerText, type))
    ) {
      globalFilterTab.push(filtersHTMLCode(filter.target.innerText, type));
      console.log(globalFilterTab);
      chosenFilters.innerHTML = globalFilterTab;
    }
    if (globalFilterTab.length > 0) {
      chosenFilters.style.display = "flex";
    } else {
      chosenFilters.style.display = "none";
    }
    searchRecipe(filter.target.innerText);
  }
}

function removeFilter(value, type) {
  let index = globalFilterTab.indexOf(value);
  globalFilterTab.splice(index, 1);
  let chosenFilters = document.getElementById("chosen-filters");
  chosenFilters.innerHTML = globalFilterTab;
}

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
      console.log(filterDropdownSelect);
      filterDropdownSelect.forEach((el) =>
        el.addEventListener("click", (event) => {
          filterSearch(event, "device");
        })
      );
    });
}

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
      console.log(filterDropdownSelect);
      filterDropdownSelect.forEach((el) =>
        el.addEventListener("click", (event) => {
          filterSearch(event, "utensil");
        })
      );
    });
}

let searchBarIngredients = document.getElementById("ingredient-searchbar");
let searchBarDevices = document.getElementById("device-searchbar");
let searchBarUtensils = document.getElementById("utensil-searchbar");
searchBarIngredients.addEventListener("keydown", showIngredients);
searchBarDevices.addEventListener("keydown", showDevices);
searchBarUtensils.addEventListener("keydown", showUtensils);
