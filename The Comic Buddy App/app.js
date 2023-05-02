// The Super Hero Entry

class SuperheroEntry {
  constructor(superheroName, superheroUniverse, superheroPower) {
    this.superheroName = superheroName;
    this.superheroUniverse = superheroUniverse;
    this.superheroPower = superheroPower;
  }
}

class SuperheroList {
  addSuperhero(entry) {
    const listData = document.querySelector(".superhero-list-data");

    const listContainer = document.createElement("ul");
    listContainer.setAttribute("id", "list");
    listContainer.innerHTML += `
    <li>${entry.superheroName}</li>
    <li>${entry.superheroUniverse}</li>
    <li>${entry.superheroPower}</li>
    <i class="fas fa-trash"></i>
    `;

    listData.appendChild(listContainer);
  }
  clearSuperheroInputs() {
    [
      document.querySelector("#name").value,
      document.querySelector("#universe").value,
      document.querySelector("#power").value,
    ] = ["", "", ""];
  }

  validationError() {
    document.querySelector(".validate-error").classList.add("show-validation");
    setTimeout(() => {
      document
        .querySelector(".validate-error")
        .classList.remove("show-validation");
    }, 2500);
  }

  validationSuccess() {
    document
      .querySelector(".validate-success")
      .classList.add("show-validation");
    setTimeout(() => {
      document
        .querySelector(".validate-success")
        .classList.remove("show-validation");
    }, 1500);
  }
}

class StoreSuperhero {
  static getSuperhero() {
    let superheroes;
    if (localStorage.getItem("superheroes") === null) {
      superheroes = [];
    } else {
      superheroes = JSON.parse(localStorage.getItem("superheroes"));
    }
    return superheroes;
  }
  static addSuperhero(entry) {
    const superherosList = StoreSuperhero.getSuperhero();
    superherosList.push(entry);
    localStorage.setItem("superheroes", JSON.stringify(superherosList));
  }

  static displaySuperhero() {
    const superheroesList = StoreSuperhero.getSuperhero();

    superheroesList.forEach((superhero) => {
      // Instantiating the SuperheroList Class
      const list = new SuperheroList();
      list.addSuperhero(superhero);
    });
  }

  static removeSuperhero(clickedSuperhero) {
    const superheroesList = StoreSuperhero.getSuperhero();
    superheroesList.forEach((superhero, index) => {
      if (superhero.superheroName === clickedSuperhero) {
        superheroesList.splice(index, 1);
      }
    });
    localStorage.setItem("superheroes", JSON.stringify(superheroesList));
  }
}

// Events

document.addEventListener("DOMContentLoaded", StoreSuperhero.displaySuperhero);

const form = document.querySelector(".superhero-form");
form.addEventListener("submit", function (e) {
  e.preventDefault();

  let [superheroName, superheroUniverse, superheroPower] = [
    document.querySelector("#name").value,
    document.querySelector("#universe").value,
    document.querySelector("#power").value,
  ];

  const entry = new SuperheroEntry(
    superheroName,
    superheroUniverse,
    superheroPower
  );
  const list = new SuperheroList();

  if (
    superheroName === "" ||
    superheroUniverse === "" ||
    superheroPower === ""
  ) {
    list.validationError();
  } else {
    list.addSuperhero(entry);
    list.clearSuperheroInputs();
    list.validationSuccess();

    // Adding superhero to localStorage
    StoreSuperhero.addSuperhero(entry);
  }
});

// Deleting Listed Superheroes
const listData = document.querySelector(".superhero-list-data");
listData.addEventListener("click", function (e) {
  if (e.target.className === "fas fa-trash") {
    const trash = e.target.parentNode;
    const clickedSuperhero =
      e.target.previousElementSibling.previousElementSibling
        .previousElementSibling.textContent;
    StoreSuperhero.removeSuperhero(clickedSuperhero);
    trash.remove();
  }
});
