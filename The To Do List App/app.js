const clearBtn = document.querySelector(".clear");
const toDoList = document.querySelector("#list");
const toDoInput = document.querySelector("#input");
const toDoAddBtn = document.querySelector(".fa-plus-circle");

// ------------------------------------------------------------------------------------

//  Selecting the icon class names
const checkBtn = "fa-check-circle";
const uncheckBtn = "fa-circle-thin";
const textLineThrough = "line-through";

// To Do Container

let toDoContainer, id;

let toDoData = localStorage.getItem("to-do-item");
if (toDoData) {
  toDoContainer = JSON.parse(toDoData);
  id = toDoContainer.length;
  loadToDoContainer(toDoContainer);
} else {
  toDoContainer = [];
  id = 0;
}

function loadToDoContainer(toDoContainer) {
  for (let i = 0; i < toDoContainer.length; i++) {
    const item = toDoContainer[i];
    addToDo(item.name, item.id, item.done, item.trash);
  }
}

// Clear the localStorage
clearBtn.addEventListener("click", function () {
  localStorage.clear();
  location.reload();
});

//  addToDo Function

function addToDo(toDo, id, done, trash) {
  if (trash) return;
  const toDoDone = done ? checkBtn : uncheckBtn;
  const toDoLine = done ? textLineThrough : "";
  const item = `
              <li class = "item">
                <i class="fa ${toDoDone} complete" status="complete" id="${id}"></i>
                <p class="text ${toDoLine}">${toDo}</p> 
                <i class="fa fa-trash-o delete" status="delete" id="${id}"></i>
              </li>
              `;
  const toDoItemPosition = "beforeend";
  toDoList.insertAdjacentHTML(toDoItemPosition, item);
}

// --------------------------------------------------------------

//  Adding a to-do to the list when enter key is pressed
document.addEventListener("keyup", displayToDo);

// Adding a to-do to the list when the plus icon is clicked
toDoAddBtn.addEventListener("click", displayToDo);

// displayToDo function
function displayToDo(event) {
  if (
    event.keyCode === 13 ||
    event.target.classList.value === "fa fa-plus-circle"
  ) {
    // checking whether the input field is NOT empty
    let toDo = toDoInput.value;
    if (toDo) {
      addToDo(toDo, id, false, false);
      toDoContainer.push({
        name: toDo,
        id: id,
        done: false,
        trash: false,
      });

      // persisting to localStorage -> updating the local storage
      localStorage.setItem("to-do-item", JSON.stringify(toDoContainer));

      id++;
    }
    toDoInput.value = "";
  }
}

//  When a to do is completed
function completeToDo(toDoItem) {
  toDoItem.classList.toggle(checkBtn);
  toDoItem.classList.toggle(uncheckBtn);
  toDoItem.nextElementSibling.classList.toggle(textLineThrough);

  toDoContainer[toDoItem.id].done = !toDoContainer[toDoItem.id].done;
  console.log(toDoContainer[toDoItem.id].done);
}

// When a to do is removed
function removeToDo(toDoItem) {
  toDoItem.parentNode.parentNode.removeChild(toDoItem.parentNode);
  toDoContainer[toDoItem.id].trash = true;
}

//  Targeting the dynamically created todo items
toDoList.addEventListener("click", function (evt) {
  const toDoItem = evt.target;
  const toDoStatus = toDoItem.attributes.status?.value;
  if (toDoStatus === "complete") {
    completeToDo(toDoItem);
  } else if (toDoStatus === "delete") {
    removeToDo(toDoItem);
  }
  localStorage.setItem("to-do-item", JSON.stringify(toDoContainer));
});

//
