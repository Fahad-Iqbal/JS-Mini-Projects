const keys = document.querySelectorAll(".key");
const blackKeys = document.querySelectorAll(".key.black");
const whiteKeys = document.querySelectorAll(".key.white");

keys.forEach(function (key) {
  key.addEventListener("click", () => {
    playNote(key);
  });
});

function playNote(key) {
  const noteAudio = document.getElementById(`${key.getAttribute("data-note")}`);
  noteAudio.currentTime = 0;
  noteAudio.play();
  key.classList.add("active");
  noteAudio.addEventListener("ended", function () {
    key.classList.remove("active");
  });
}

const noteObject = {
  z: ["C", true],
  s: ["Db", true],
  x: ["D", true],
  d: ["Eb", true],
  c: ["E", true],
  v: ["F", true],
  g: ["Gb", true],
  b: ["G", true],
  h: ["Ab", true],
  n: ["A", true],
  j: ["Bb", true],
  m: ["B", true],
};

document.addEventListener("keydown", function (e) {
  const key = e.key;
  e.repeat = false;
  if (noteObject[key]) {
    const noteAudio = document.getElementById(`${noteObject[key][0]}`);
    const keyDiv = document.querySelector(
      `.key[data-note='${noteAudio.getAttribute("id")}']`
    );
    if (noteObject[key[1]]) {
      noteAudio.currentTime = 0;
    }
    noteAudio.play();
    noteObject[key[1]] = false;
    keyDiv.classList.add("active");
    document.addEventListener("keyup", function (e) {
      keyDiv.classList.remove("active");
      noteObject[key[1]] = true;
    });
  }
});

for (const key in noteObject) {
  console.log(`${key}: ${noteObject[key][0]}`);
}
