const datalist = document.querySelector('#allpokemons');
//const poke = document.querySelector('#poke');
const img = document.getElementById('pokeImage');
const button = document.querySelector('button');
const form = document.getElementById('form');
/*
const getpokemons = _ => {
  fetch('https://pokeapi.co/api/v2/pokemon/?limit=1118')
    .then(response => response.json())
    .then(data => {
      addoptions(data.results);
    })
};

const addoptions = pokemons => {
  let out = '';
  pokemons.forEach(pokemon => {
    out += `<option value="${pokemon.name}" class="autocomplete-item"/>`;
  });
  datalist.innerHTML = out;
  form.addEventListener('submit', findpokemon);
};
*/

window.onload = function () {
  var url = document.location.href,
      params = url.split('?')[1].split('&'),
      data = {}, tmp;
  for (var i = 0, l = params.length; i < l; i++) {
       tmp = params[i].split('=');
       data[tmp[0]] = tmp[1];
  }
  //document.getElementById('here').innerHTML = data.name;
  findpokemon(data.name);
}

function findpokemon(name){
  //let name = poke.value;
  //let name = "charizard";
  name = name.replace(' - ', '/').toLowerCase();
  url = `https://pokeapi.co/api/v2/pokemon/${name}`
  getpokemon(name); 
};


function getpokemon(name) {
  pokeapi_Error = false;
  //button.classList.remove('error');
  //button.classList.add('loading');
  fetch(url)
  .then(response => {
    if (!response.ok) {
      pokeapi_Error = true;
      console.log('Hubo un problema con pokeapi');
      document.getElementById('webpage').hidden = true;
      document.getElementById("error").style.visibility = 'visible';
      document.getElementById("error").innerHTML += "<p>Error: Cannot find the pokemon information from pokeapi</p>";
    } else {
      return response.json();
    }
  })
  .then((data) => {
      var name = data.forms[0].name,
        pokeImgFront = data.sprites.front_default,
        pokeImgBack = data.sprites.back_default,
        pokeImgShinyFront = data.sprites.front_shiny,
        pokeImgShinyBack = data.sprites.back_shiny,
        shiny = false,
        front = true,
        speed = data.stats[5].base_stat,
        spDef = data.stats[4].base_stat,
        spAtk = data.stats[3].base_stat,
        def = data.stats[2].base_stat,
        atk = data.stats[1].base_stat,
        hp = data.stats[0].base_stat,
        id = data.id,
        weight = (data.weight * 0.1).toFixed(2) + " kg";
        height = (data.height * 0.1).toFixed(2) + " meters";
        types = [];
        img.src = `${pokeImgFront}`;
        img.alt += name;

        document.getElementById("default").onclick = function(){
          shiny = false;
          document.getElementById("shiny").className = "";
          document.getElementById("default").className += " active";
          if (front) {img.src = `${pokeImgFront}`;}
          else {img.src = `${pokeImgBack}`;}
        };
        document.getElementById("shiny").onclick = function(){
          shiny = true;
          document.getElementById("default").className = "";
          document.getElementById("shiny").className += " active";
          if (front) {img.src = `${pokeImgShinyFront}`;}
          else {img.src = `${pokeImgShinyBack}`;}
        };
        document.getElementById("front").onclick = function(){
          front = true;
          document.getElementById("back").className = "";
          document.getElementById("front").className += " active";
          if (shiny) {img.src = `${pokeImgShinyFront}`;}
          else {img.src = `${pokeImgFront}`;}
        };
        document.getElementById("back").onclick = function(){
          front = false;
          document.getElementById("front").className = "";
          document.getElementById("back").className += " active";
          if (shiny) {img.src = `${pokeImgShinyBack}`;}
          else {img.src = `${pokeImgBack}`;}
        };

        document.getElementById("name").innerHTML = name;
        document.getElementById("ID").innerHTML += id;
        document.getElementById("Height").innerHTML += height;
        document.getElementById("Weight").innerHTML += weight;

        document.getElementById("atk2").innerHTML += atk;
        document.getElementById("atk2").style.width = atk*100/255 + "%";

        document.getElementById("def2").innerHTML += def;
        document.getElementById("def2").style.width = def*100/255 + "%";

        document.getElementById("hp2").innerHTML += hp;
        document.getElementById("hp2").style.width = hp*100/255 + "%";

        document.getElementById("speed2").innerHTML += speed;
        document.getElementById("speed2").style.width = speed*100/255 + "%";

        document.getElementById("spDef2").innerHTML += spDef;
        document.getElementById("spDef2").style.width = spDef*100/255 + "%";

        document.getElementById("spAtk2").innerHTML += spAtk;
        document.getElementById("spAtk2").style.width = spAtk*100/255 + "%";

        appearance(name);
      for (var i = 0; i < data.types.length; i++) {
        var type = data.types[i].type.name;
        types.push(type);
      }
      //document.getElementById("type").innerHTML += types[0];
     // if (types.length == 2) {document.getElementById("type").innerHTML +=  " - " + types[1]}; 
    
      types = data.types
      function pokemonType(types) {
        for (var i = 0; i < types.length; i++) {
          document.getElementById("types").innerHTML +=
            "<p class='pokeType poke-info " +
              types[i].type.name +
              "'>" +
              types[i].type.name +
              " </p>";
        }
      }
      pokemonType(types);
      abilities(data);
      moves(data);


    /*imagecontainer.src = `${data.message}`;
    let bits = data.message.split('/');
    bits = bits[bits.length-2]
           .split('-')
           .map(b => ucfirst(b))
           .join(' - ');
    breedinfo.innerText = bits;*/
  }).catch(function(error) {
    if (!pokeapi_Error) {
    console.log('There was a problem with the Fetch petition:' + error.message);
    document.getElementById('webpage').hidden = true;
    document.getElementById("error").style.visibility = 'visible';
    document.getElementById("error").innerHTML += "<p>Error connecting to the internet, check your connection</p>";
    document.getElementById("error").innerHTML += "<button id=error_button onClick=window.location.reload();>Reload page </button>";}
  })
}

function abilities(data) {
 /* var obj, dbParam, xmlhttp, myObj, x, txt = "";
  obj = { table: sel, limit: 20 };
  dbParam = JSON.stringify(obj);
  xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      myObj = JSON.parse(this.responseText);*/
      txt = "";
      //txt += "<table border='1'>";
      for (var i = 0; i < data.abilities.length; ++i) {
        txt += "<tr><td>" + data.abilities[i].ability.name;
        if(data.abilities[i].is_hidden) {txt += "<td>yes</td>"}
        else {txt += "<td>no</td>"};
        txt += "</td></tr>";
      }
      txt += "</table>"
      document.getElementById("ability_list").innerHTML += txt;
    }
  //};
//}

function moves(data) {
       txt = "";
       for (var i = 0; i < data.moves.length; ++i) {
         txt += "<tr><td>" + data.moves[i].move.name
         //+ "<td>" + data.moves[i].version_group_details[0].level_learned_at
         txt += "</td></tr>";
       }
       txt += "</table>"
       document.getElementById("move_list").innerHTML += txt;
     }
   //};
 //}

function appearance(nam) {
  url = `https://pokeapi.co/api/v2/pokemon-species/${nam}`;
  return fetch(url)
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      //button.classList.remove('loading');
      //button.classList.add('error');
    }
  })
  .then((data) => {
    for (let i of data.flavor_text_entries) {
      if (i.language.name == "en"){ document.getElementById("description").innerHTML += i.flavor_text;
      break;}
    }
    //data.flavor_text_entries.forEach(//console.log(data));
    //flavor_text_entries => function(){if (language.name === "en")
    //  document.getElementById("description").innerHTML = flavor_text;});
      //function("en")
      //if (language == "en")
      //document.getElementById("description").innerHTML = flavor_text;));
    gen = data.generation.name;
    //console.log(data);
    //console.log("Hello world!");
    //document.getElementById("description").innerHTML = data.flavor_text_entries[0].flavor_text;
    switch (gen) {
      case "generation-i":
        document.getElementById("appearence").innerHTML += "first generation";
        break;
      case "generation-ii":
        document.getElementById("appearence").innerHTML += "second generation";
        break;
      case "generation-iii":
        document.getElementById("appearence").innerHTML += "third generation";
        break;
      case "generation-iv":
        document.getElementById("appearence").innerHTML += "fourth generation";
        break;
      case "generation-v":
        document.getElementById("appearence").innerHTML += "fifth generation";
        break;
      case "generation-vi":
        document.getElementById("appearence").innerHTML += "sixth generation";
        break;
      case "generation-vii":
        document.getElementById("appearence").innerHTML += "seventh generation";
        break;
      case "generation-viii":
        document.getElementById("appearence").innerHTML += "eighth generation";
        break;
    }
})
  }

//form.addEventListener('submit', getpokemon);

//document.querySelector('form').addEventListener('submit', e => { e.preventDefault(); });
//getpokemons();
