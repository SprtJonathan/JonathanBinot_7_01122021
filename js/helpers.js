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
