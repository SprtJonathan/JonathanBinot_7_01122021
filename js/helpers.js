// Ce fichier contient des fonctions qui seront amenées à être réutiliser. Ceci afin de ne pas les réécrire à chaque occurence

// Création du code HTML pour l'affichage des photographes du site
function createHTMLCode(recipe) {
  const photographerHtmlCode = `
<article class="recipe--article">
<figure class="recipe--figure">
<div class="recipe--figure--background"></div>
<figcaption class="recipe--figcaption">
  <div class="recipe--name-time">
    <h2 id="name-${recipe.id}" class="recipe--name-time--name">${recipe.name}</h2>
    <h2 id="time-${recipe.id}" class="recipe--name-time--time"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clock" viewBox="0 0 16 16">
    <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
  </svg> ${recipe.time} min</h2>
  </div>
  <div class="recipe--ingredients-description">
    <div id="ingredients-${recipe.id}" class="recipe--ingredients-description--ingredients">
    </div>
    <p id="description" class="recipe--ingredients-description--description">${recipe.description}</p>
  </div>
</figcaption>
</figure>
</article> 
`;

  return photographerHtmlCode;
}

function displayIngredients(recipe) {
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

function createFiltersHTMLCode(array, listDiv) {
  listDiv.innerHTML = "";
  for (i = 0; i < array.length; i++) {
    listDiv.innerHTML += `<div id="filter-${array[i].type}-${i}" class="filters--selection background--${array[i].type}"><span class="filters--selection--text">${array[i].name}</span><button class="btn" onclick="removeFilter(${i}, '${array[i].type}')"><i class="bi bi-x-circle"></i></button></div>`;
  }
}

/*
function filtersHTMLCode(value, type) {
  return `<div id="filter-${type}" class="filters--selection background--${type}"><span class="filters--selection--text">${value}</span><button class="btn" onclick="removeFilter('${value}','${type}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-x-circle" viewBox="0 0 16 16">
    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
  </svg></button></div>`;
}*/

function normalizeString(string) {
  return string
    .toLowerCase() // Transformation de tous les caractères en minuscule
    .normalize("NFD") // Normalisation des caractères (Normalization Form Canonical Decomposition)
    .replace(/[\u0300-\u036f]/g, "");
}


function verifyTag(array, value) {
  return normalizeString(array).includes(normalizeString(value)); // Pour les noms de recettes, on cherche lesquels correspondent au mot entré dans la barre de recherche
}
