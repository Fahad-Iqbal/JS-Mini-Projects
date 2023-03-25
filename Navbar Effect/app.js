const sections = document.querySelectorAll("section");
const trans = document.querySelector(".trans");
const gradients = ["coral", "chartreuse", "chocolate", "cadetblue"];

const options = {
  threshold: 0.7,
};

const initalLink = document.querySelector(`[data-page="home"]`);
const initialCoordinates = initalLink.getBoundingClientRect();
const initialDirections = {
  height: initialCoordinates.height,
  width: initialCoordinates.width,
  top: initialCoordinates.top,
  left: initialCoordinates.left,
};

trans.style.setProperty("height", `${initialDirections.height}px`);
trans.style.setProperty("width", `${initialDirections.width}px`);
trans.style.setProperty("top", `${initialDirections.top}px`);
trans.style.setProperty("left", `${initialDirections.left}px`);

let observer = new IntersectionObserver(navScroll, options);

function navScroll(entries) {
  entries.forEach(function (entry) {
    const className = entry.target.className;
    const activeLink = document.querySelector(`[data-page="${className}"]`);
    const elementIndex = entry.target.getAttribute("data-index");
    const coordinates = activeLink.getBoundingClientRect();
    const directions = {
      height: coordinates.height,
      width: coordinates.width,
      top: coordinates.top,
      left: coordinates.left,
    };
    if (entry.isIntersecting) {
      trans.style.setProperty("height", `${directions.height}px`);
      trans.style.setProperty("width", `${directions.width}px`);
      trans.style.setProperty("top", `${directions.top}px`);
      trans.style.setProperty("left", `${directions.left}px`);
      trans.style.setProperty("background-color", `${gradients[elementIndex]}`);
    }
  });
}

sections.forEach(function (section) {
  observer.observe(section);
});
