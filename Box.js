const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const newGameButton = document.getElementById("newGame");
const startGameButton = document.getElementById("startGame");
const rulesBox = document.getElementById("rules");
let count = 0;
let delay = 0;
let speed = 1;
let gameOver = true;
let gameStart = true;
let maxFigure = 5;
let figuresArray = [];
let maxDelay = 100;
const mouseCoordinate = {
  x: NaN,
  y: NaN,
};
class Figure {
  constructor() {
    this.y = Math.random() * 100;
    this.size = Math.random() * 70 + 50;
    this.x = Math.random() * (canvas.width - this.size - 10) + 10;
    this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    this.dy = Math.random() + 0.5;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.size, this.size);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  update() {
    this.y += this.dy * speed;
    if (this.y > canvas.height) {
      gameOver = true;
    }
  }
}
function deleteFigure() {
  newFiguresArray = figuresArray.filter(
    (figure) =>
      !(
        mouseCoordinate.x > figure.x &&
        mouseCoordinate.x < figure.x + figure.size &&
        mouseCoordinate.y > figure.y &&
        mouseCoordinate.y < figure.y + figure.size
      )
  );
  if (newFiguresArray.length < figuresArray.length) {
    count += figuresArray.length - newFiguresArray.length;
  }
  figuresArray = newFiguresArray;
}
function init() {
  for (i = 0; i < maxFigure; i++) {
    figuresArray.push(new Figure());
  }
}

function animate() {
  ctx.font = "48px serif";
  if (!gameOver) {
    if (delay > maxDelay) {
      maxFigure += 1;
      speed += 0.1;
      maxDelay += 40;
      for (let i = 0; i < maxFigure; i++) {
        figuresArray.push(new Figure());
        delay = 0;
      }
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#141414";
    ctx.fillText(`Очки: ${count}`, 100, 50);
    figuresArray.forEach((figure) => {
      figure.update();
      figure.draw();
    });
    requestAnimationFrame(animate);
    delay += 1;
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    figuresArray.length = 0;
    delay = 0;
    maxFigure = 5;
    speed = 1;
    maxDelay = 100;
    ctx.fillStyle = "#141414";
    ctx.textAlign = "center";
    ctx.fillText(`ВЫ ПРОИГРАЛИ!\r\nВаши очки: ${count}`, canvas.width / 2, canvas.height / 2);
    newGameButton.style.display = "block";
    requestAnimationFrame(animate);
  }
}

startGameButton.addEventListener("mousedown", () => {
  rulesBox.style.opacity = "0";
  setTimeout(() => {
    (rulesBox.style.display = "none"), (gameOver = false);
    init();
    canvas.style.display = "block";
    animate();
  }, 300);
});
newGameButton.addEventListener("click", () => {
  newGameButton.style.display = "none";
  gameOver = false;
  count = 0;
  init();
});
document.addEventListener("click", (e) => {
  mouseCoordinate.x = e.x;
  mouseCoordinate.y = e.y;
  deleteFigure();
});