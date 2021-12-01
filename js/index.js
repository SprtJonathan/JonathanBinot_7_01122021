function filterFunction() {
  let input = document.getElementById("myInput");
  let filter = input.value.toUpperCase();
  let filterSelection = document.querySelectorAll(
    ".filters--dropdown--ingredients--selection"
  );
  console.log(filterSelection);
  for (let i = 0; i < filterSelection.length; i++) {
    input.value = filterSelection[i].textContent || filterSelection[i].innerText;
    if (input.value.toUpperCase().indexOf(filter) > -1) {
        filterSelection[i].style.display = "filters--dropdown--ingredients--selection";
    } else {
        filterSelection[i].style.display = "filters--dropdown--ingredients--selection--hidden";
    }
  }
}

// Fonction permettant d'afficher les options des filtres
function displayOptions() {
  let filterSelection = document.querySelectorAll(
    ".filters--dropdown--ingredients--selection--hidden"
  );
  console.log(filterSelection);
  for (let i = 0; i < filterSelection.length; i++) {
    filterSelection[i].className = "filters--dropdown--ingredients--selection";
  }
}

// Fonction permettant de cacher les options des filtres
function hideOptions() {
  let filterSelection = document.querySelectorAll(
    ".filters--dropdown--ingredients--selection"
  );
  console.log(filterSelection);
  for (let i = 0; i < filterSelection.length; i++) {
    filterSelection[i].className =
      "filters--dropdown--ingredients--selection--hidden";
  }
}
