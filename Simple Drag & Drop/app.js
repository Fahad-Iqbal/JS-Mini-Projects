const lists = document.querySelectorAll(".list");
const listItems = document.querySelectorAll(".list-item");

let draggedItem = null;

for (let a = 0; a < listItems.length; a++) {
  const item = listItems[a];

  item.addEventListener("dragstart", function () {
    draggedItem = item;
    setTimeout(() => {
      document.body.style.cursor = "grabbing";
      item.style.display = "none";
    }, 50);
  });

  item.addEventListener("dragend", function () {
    setTimeout(() => {
      document.body.style.cursor = "auto";
      item.style.display = "block";
      item.style.cursor = "grab";
      draggedItem = null;
    }, 50);
  });

  for (let b = 0; b < lists.length; b++) {
    const list = lists[b];
    list.addEventListener("dragover", function (e) {
      e.preventDefault();
    });
    list.addEventListener("dragenter", function (e) {
      e.preventDefault();
      list.style.backgroundColor = "rgba(255, 255, 255, 0.7)";
    });

    list.addEventListener("dragleave", function (e) {
      list.style.backgroundColor = "rgba(88, 65, 83, 0.5)";
    });

    list.addEventListener("drop", function () {
      list.append(draggedItem);
      list.style.backgroundColor = "rgba(88, 65, 83, 0.5)";
    });
  }
}
