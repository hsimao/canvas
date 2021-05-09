import Game from "./Game.js";

const $startBtn = document.getElementById("startBtn");
const $panel = document.querySelector(".panel");
const $score = document.querySelector(".score");

const handleStartGame = () => {
  $panel.classList.add("hide");
};

const handleEndGame = ({ score }) => {
  $panel.classList.remove("hide");
  $score.innerText = `Score: ${score}`;
};

const canvas = document.getElementById("canvas");
const game = new Game(canvas, {
  onStart: handleStartGame,
  onEnd: handleEndGame
});

$startBtn.addEventListener("click", () => game.startGame());
