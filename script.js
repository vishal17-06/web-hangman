// ---------------- WORD LIST ----------------
const words = [
  "abruptly","absurd","abyss","affix","awkward","axiom","azure",
  "bagpipes","bandwagon","banjo","beekeeper","blizzard",
  "buzzwords","caliph","cobweb","crypt","dizzying",
  "embezzle","equip","espionage","fjord","flapjack",
  "galaxy","gazebo","glyph","gnostic","grogginess",
  "hyphen","icebox","injury","ivory","jackpot","jazzy",
  "jigsaw","jiujitsu","jovial","jukebox","kayak","kazoo",
  "kilobyte","kiosk","klutz","larynx","luxury","lymph",
  "mnemonic","mystify","nightclub","nymph","onyx",
  "oxygen","pajama","phlegm","pixel","puzzling",
  "quartz","queue","quixotic","quiz","rhythm",
  "sphinx","strength","subway","syndrome","thumbscrew",
  "transcript","twelfth","unknown","unzip","uptown",
  "vaporize","vortex","whiskey","wizard","xylophone",
  "yippee","zephyr","zigzag","zombie"
];

// ---------------- ELEMENTS ----------------
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const wordEl = document.getElementById("word");
const lettersEl = document.getElementById("letters");
const messageEl = document.getElementById("message");
const livesEl = document.getElementById("lives");
const difficultyEl = document.getElementById("difficulty");

const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");
const winSound = document.getElementById("winSound");
const loseSound = document.getElementById("loseSound");

// ---------------- GAME STATE ----------------
let selectedWord = "";
let guessedLetters = [];
let lives = 6;

// ---------------- DRAW HANGMAN ----------------
function drawBase() {
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;

  ctx.beginPath(); ctx.moveTo(50, 250); ctx.lineTo(250, 250); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(100, 250); ctx.lineTo(100, 50); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(100, 50); ctx.lineTo(200, 50); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(200, 50); ctx.lineTo(200, 80); ctx.stroke();
}

function drawHead() {
  ctx.beginPath();
  ctx.arc(200, 100, 20, 0, Math.PI * 2);
  ctx.stroke();
}
function drawBody() {
  ctx.beginPath(); ctx.moveTo(200, 120); ctx.lineTo(200, 180); ctx.stroke();
}
function drawLeftArm() {
  ctx.beginPath(); ctx.moveTo(200, 140); ctx.lineTo(170, 160); ctx.stroke();
}
function drawRightArm() {
  ctx.beginPath(); ctx.moveTo(200, 140); ctx.lineTo(230, 160); ctx.stroke();
}
function drawLeftLeg() {
  ctx.beginPath(); ctx.moveTo(200, 180); ctx.lineTo(170, 220); ctx.stroke();
}
function drawRightLeg() {
  ctx.beginPath(); ctx.moveTo(200, 180); ctx.lineTo(230, 220); ctx.stroke();
}

const drawSteps = [
  drawHead,
  drawBody,
  drawLeftArm,
  drawRightArm,
  drawLeftLeg,
  drawRightLeg
];

// ---------------- GAME LOGIC ----------------
function startGame() {
  selectedWord = words[Math.floor(Math.random() * words.length)];
  guessedLetters = [];

  const diff = difficultyEl.value;
  lives = diff === "easy" ? 8 : diff === "medium" ? 6 : 4;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBase();

  livesEl.textContent = `Lives: ${lives}`;
  messageEl.textContent = "Guess a letter";

  createButtons();
  updateWord();
}

function createButtons() {
  lettersEl.innerHTML = "";
  for (let i = 65; i <= 90; i++) {
    const btn = document.createElement("button");
    btn.textContent = String.fromCharCode(i);
    btn.onclick = () => guessLetter(btn.textContent.toLowerCase(), btn);
    lettersEl.appendChild(btn);
  }
}

function guessLetter(letter, button) {
  button.disabled = true;

  if (selectedWord.includes(letter)) {
    guessedLetters.push(letter);
    correctSound.play();
    messageEl.textContent = "Correct 👍";
  } else {
    wrongSound.play();
    drawSteps[drawSteps.length - lives]();
    lives--;
    livesEl.textContent = `Lives: ${lives}`;
    messageEl.textContent = "Wrong ❌";
  }

  updateWord();
  checkGameOver();
}

function updateWord() {
  wordEl.textContent = selectedWord
    .split("")
    .map(l => guessedLetters.includes(l) ? l : "_")
    .join(" ");
}

function checkGameOver() {
  if (lives === 0) {
    loseSound.play();
    messageEl.textContent = `Game Over ☠️ Word was "${selectedWord}"`;
    disableAll();
  }
  if (!wordEl.textContent.includes("_")) {
    winSound.play();
    messageEl.textContent = "You Win 🎉";
    disableAll();
  }
}

function disableAll() {
  document.querySelectorAll("#letters button").forEach(b => b.disabled = true);
}

function restartGame() {
  startGame();
}

// Keyboard support
document.addEventListener("keydown", e => {
  const letter = e.key.toLowerCase();
  if (letter < "a" || letter > "z") return;

  document.querySelectorAll("#letters button").forEach(btn => {
    if (btn.textContent.toLowerCase() === letter && !btn.disabled) {
      guessLetter(letter, btn);
    }
  });
});

startGame();
