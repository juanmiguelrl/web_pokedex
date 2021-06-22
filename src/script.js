// --------------------------
//          API
// --------------------------
const api_url = "https://pokeapi.co/api/v2/";

// --------------------------
//        SEARCH
// --------------------------

/* Snackbar with error messages */
const showSnackbar = error => {
  let snackbar = document.getElementById("snackbar");

  // Check if is hidden
  if (snackbar.className === "" || snackbar.className == null)
    snackbar.className = "show";

  // May happen another error while the snackbar is visible
  snackbar.innerHTML = error;
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("snackbar").addEventListener('click', function () {
    snackbar.className = "";
  });
});

/* Autocomplete search list */
var pokemons = [];

const autocomplete = _ => {
  let options = document.querySelector('#allpokemons');
  options.innerHTML = '';

  fetch(`${api_url}pokemon/?limit=${1118}`)
    .then(response => {
      if (response.ok) return response.json();
      else throw Error("Request error");
    })
    .then(data => data.results.forEach(pokemon => {
      pokemons.push(pokemon.name);
      options.innerHTML += `<option value="${pokemon.name}"/>`;
    }))
    .catch(_ => showSnackbar("Cannot establish a connection with the server"));
}

/* Submit functionality */
const errorSearch = bar => {
  let error = document.getElementById('unknown-poke');
  error.innerHTML = '';
  bar.style.border = "1px solid var(--border_color)";

  if (bar.value != '' && !pokemons.includes(bar.value)) {
    bar.style.border = "1px solid var(--error_color)";
    error.innerHTML = 'That Pokemon does not exist!';
    return true;
  }

  document.getElementById("search-form").action = "result.html?name=" + bar.value;
  return false;
};

document.addEventListener("DOMContentLoaded", function () {
  autocomplete();

  document.getElementById("search-form").addEventListener("submit", function (ev) {
    window.location = this.action;
    ev.preventDefault();
  });

  document.getElementById("search-bar").addEventListener("change", function () {
    if (errorSearch(this) || this.value == '')
      document.getElementById("search-button").disabled = true;
    else
      document.getElementById("search-button").removeAttribute("disabled");
  });
});


// --------------------------
//      FILTER SETTINGS
// --------------------------

/* Expand and close collapsible */
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("filter-collapsible").addEventListener("click", function () {
    this.classList.toggle("active");
    let container = this.nextElementSibling;
    container.style.display = (container.style.display === "grid" ? "none" : "grid");
  });
});

/* Range filter */
var currentMin = 1;
var currentMax = 1118;

const checkLimits = (number, min, max) => {
  if (number < min)
    return min;
  else if (number > max)
    return max;
  return number;
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("min-range").addEventListener("change", function () {
    this.value = checkLimits(this.value, 1, parseInt(currentMax));
    if (this.value != currentMin) {
      currentMin = this.value;
      updateList();
    }
  });

  document.getElementById("max-range").addEventListener("change", function () {
    this.value = checkLimits(this.value, parseInt(currentMin), 1118);
    if (this.value != currentMax) {
      currentMax = this.value;
      updateList();
    }
  });
});

/* Type filters */
var types = [];
var type1 = '';
var type2 = '';

const autocomplete_types = _ => {
  var datalist = document.getElementById('alltypes');
  datalist.innerHTML = '';

  fetch(`${api_url}type/`)
    .then(response => response.json())
    .then(data => data.results.forEach(type => {
      types.push(type.name);
      datalist.innerHTML += `<option value="${type.name}"/>`;
    }));
}

document.addEventListener("DOMContentLoaded", function () {
  autocomplete_types();

  document.getElementById('type1').addEventListener("change", function () {
    if (this.value == type1)
      return;
    type1 = this.value;

    let error = document.getElementById('unknown-type1');
    error.innerHTML = '';
    this.style.borderBottom = "2px solid white";
    
    if (this.value.length != 0 && !types.includes(this.value)) {
      this.style.borderBottom = "2px solid #FF7171";
      error.innerHTML = 'Unknown type';
    } else
      fetchType(type1, 1);

  });

  document.getElementById('type2').addEventListener("change", function (e) {
    if (this.value == type2)
      return;
    type2 = this.value;

    let error = document.getElementById('unknown-type2');
    error.innerHTML = '';
    this.style.borderBottom = "1px solid white";

    if (this.value.length != 0 && !types.includes(this.value)) {
      this.style.borderBottom = "1px solid red";
      error.innerHTML = 'Unknown type';
    } else
      fetchType(type2, 2);
  });
});

/* Generation filter */
const maxGen = 8;
var gen = 0;

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById('generation').addEventListener("change", function () {
    this.value = checkLimits(this.value, 0, maxGen);
    if (this.value != gen) {
      gen = this.value;
      fetchGeneration(gen);
    }
  });
});

// --------------------------
//        CARDS GRID
// --------------------------
var list = [];          // List with all the pokemons available
var filteredList = [];  // List of pokemons with the current filters
var type1List = [];
var type2List = [];
var genList = [];

const updateList = _ => {
  /* Get all pokemons in the range */
  filteredList = list.slice(currentMin - 1, currentMax);

  /* Filter by type and generation */
  if (type1List.length > 0)
    filteredList = filteredList.filter(pokemon => type1List.includes(pokemon.name));
  if (type2List.length > 0)
    filteredList = filteredList.filter(pokemon => type2List.includes(pokemon.name));
  if (gen != 0)
    filteredList = filteredList.filter(pokemon => genList.includes(pokemon.name));

  /* Update view */
  resetGrid();
  enableGrid();
}

/* Fetch functions */
const fetchSprites = (start, end) => {
  for (let i = start; i < end; i++) {
    let pokemon = filteredList[i];
    let card = `<a class="pokemon-card" href="result.html?name=${pokemon.name}"><img alt="${pokemon.name}" src="`
    fetch(pokemon.url)
      .then(response => {
        if (response.ok) return response.json();
        else throw Error("Request error");
      })
      .then(data => {
        let sprite = data.sprites.front_default;
        if (sprite == null)
          sprite = "../img/null_sprite.png";
        card += sprite;
      })
      .catch(_ => showSnackbar("Cannot load the sprites properly"))
      .finally(_ => {
        card += '"/></a>';
        grid.innerHTML += card;
        if (i == end - 1) expanding = false;
      })
  }
}

const fetchType = (type, num) => {
  disableGrid();

  if (type.length == 0) {
    if (num == 1) type1List = [];
    else type2List = [];
    updateList();
    return;
  }
  
  fetch(`${api_url}type/${type}`)
    .then(response => {
      if (response.ok) return response.json();
      else {
        console.log(response); throw Error("Request error");
      }
    })
    .then(data => data.pokemon)
    .then(items => {
      if (num == 1)
        type1List = items.map(item => item.pokemon.name);
      else
        type2List = items.map(item => item.pokemon.name);
      updateList();
    })
    .catch(_ => {
      showSnackbar("Cannot load types properly");
      resetGrid();
    })
}

const fetchGeneration = (gen) => {
  disableGrid();

  if (gen == 0) {
    genList = [];
    updateList();
    return;
  }

  fetch(`${api_url}generation/${gen}`)
    .then(response => {
      if (response.ok) return response.json();
      else throw Error("Request error");
    })
    .then(data => data.pokemon_species)
    .then(items => {
      genList = items.map(item => item.name);
      updateList();
    })
    .catch(_ => {
      showSnackbar("Cannot load the generation");
      resetGrid();
    });
}

/* Grid */
var grid;
var loadingIcon;
var reloadButton;

var current = 0;        // Current number of pokemons displayed
var moreFactor = 0.039;  // Number of extra cards displayed when pressed "SHOW MORE" (width relative)

const enableGrid = _ => {
  loadingIcon.style.visibility = "hidden";
  expandGrid();
}

const disableGrid = _ => {
  loadingIcon.style.visibility = "visible";
  reloadButton.style.visibility = "hidden";
}

const initializeGrid = _ => {
  disableGrid();

  // Search all the pokemons (only executed once)
  fetch(`${api_url}pokemon/?limit=${currentMax}`)
    .then(response => {
      if (response.ok) return response.json();
      else throw Error("Request error");
    })
    .then(data => { list = data.results; filteredList = list; })
    .then(_ => enableGrid() )
    .catch(error => showSnackbar(error));
}

var expanding = false;

const expandGrid = _ => {
  if (expanding || current == filteredList.length)
    return;
  expanding = true;

  let limit = Math.round(Math.min(current + window.innerWidth * moreFactor, filteredList.length));
  fetchSprites(current, limit);
  current = limit;
  
  // Hide reload if there is no pokemon
  reloadButton.style.visibility = (filteredList.length < 1) ? "hidden" : "visible";
  
  
}

const resetGrid = _ => {
  loadingIcon.style.visibility = "hidden";
  reloadButton.style.visibility = "hidden";

  grid.innerHTML = '';
  current = 0;
}

document.addEventListener("DOMContentLoaded", function () {
  grid = document.getElementsByClassName('cards-grid')[0];
  loadingIcon = document.getElementsByClassName("lds-dual-ring")[0];
  reloadButton = document.getElementById("reload-grid");
});

document.addEventListener("DOMContentLoaded", function () {
  initializeGrid();

  reloadButton.addEventListener("click", function () {
    grid.innerHTML = '';
    fetchSprites(0, current);
  });

  if (window.innerWidth >= 680) {
    let cards = document.getElementsByClassName("cards")[0];
    cards.onscroll = function () {
      if (cards.scrollTop + cards.clientHeight >= 0.9 * cards.scrollHeight)
        expandGrid();
    }
  } else {
    window.onscroll = function () {
      if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight)
        expandGrid();
    }
  }
});