//jshint esversion:6

//randomly sort card classes and generate game board - mobile site holds 16 cards, desktop holds 18
const classes = ["mushroom", "flower", "oneUp", "star", "coinTen", "coinTwenty", "mushroom", "flower", "oneUp", "star", "coinTen", "coinTwenty", "mushroom", "flower", "star", "mushroom", "flower", "star"];

const classesMobile = ["mushroom", "flower", "oneUp", "star", "coinTen", "coinTwenty", "mushroom", "flower", "oneUp", "star", "coinTen", "coinTwenty", "flower", "flower", "mushroom", "mushroom"];

//randomizes cards
function shuffle(array) {
  let newArray = array.slice();
  for (let i = newArray.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}


let shuffledClasses = shuffle(classes);

let shuffledClassesMobile = shuffle(classesMobile);


function generateBoard(shuffledClasses) {
  for (let i = 0; i < shuffledClasses.length; i++) {
    let newCard = document.createElement("div");
    document.getElementById("cardBox").appendChild(newCard);
    newCard.setAttribute("class", "card " + shuffledClasses[i] + " faceDown");

    if (i === 5 || i === 11) {
      let linebreak = document.createElement("br");
      document.getElementById("cardBox").appendChild(linebreak);
    }
  }
}


function generateBoardMobile(shuffledClassesMobile) {
  for (let i = 0; i < shuffledClassesMobile.length; i++) {
    let newCard = document.createElement("div");
    document.getElementById("cardBox").appendChild(newCard);
    newCard.setAttribute("class", "card " + shuffledClassesMobile[i] + " faceDown");

    if (i === 3 || i === 7 || i === 11) {
      let linebreak = document.createElement("br");
      document.getElementById("cardBox").appendChild(linebreak);
    }
  }
}


function generateResponsiveBoard() {
  //if viewport is < 615 generates a mobile board 16 cards 4x4
  if (window.innerWidth < 615) {
    generateBoardMobile(shuffledClassesMobile);
  } else {
    //if viewport > 615 generates 18 cards 6x3
    generateBoard(shuffledClasses);
  }
}


generateResponsiveBoard();


function reassignCardClasses() {
  if (window.innerWidth < 615) {
    shuffledClassesMobile = shuffle(classesMobile);
    for (let i = 0; i < shuffledClassesMobile.length; i++) {
      cards[i].setAttribute("class", "card " + shuffledClassesMobile[i] + " faceDown");
    }
  } else {
    //if viewport > 615 generates 18 cards 6x3
    shuffledClasses = shuffle(classes);
    for (let i = 0; i < shuffledClasses.length; i++) {
      cards[i].setAttribute("class", "card " + shuffledClasses[i] + " faceDown");
    }
  }
}


//game state variables

//keep track of what card is currently flipped over
const flippedCards = [];

//keep track of matches, reset to 0 if game over
let matches = 0;

//incorrect guesses subtract one, if tries = 0 get game over screen/click to retry
let tries = 4;

//Keeps track of how many screens the player has cleared
let round = 1;

//title/scoreboard
const title = document.getElementById("title");

//cheat code for extra tries
title.addEventListener("click", function(){
  tries += 1;
  updateScore();
});

//cards array
const cards = document.getElementsByClassName("card");

//event listener - effectively the click activated game loop
for (let i = 0; i < cards.length; i++) {
  cards[i].addEventListener("click", event => {

    let card = event.target;
    let cardClass = card.classList[1];

    flipCard(card);
    checkCard(cardClass);
  });
}


function hideCards(cardClass) {
  let cardType = document.getElementsByClassName(cardClass);

  for (let i = 0; i < cardType.length; i++) {
    if (!cardType[i].classList.contains("faceDown")) {
      cardType[i].classList.add("faceDown");
      cardType[i].classList.add("hidden");
    }
  }
}


function hideAllCards() {
  for (let i = 0; i < cards.length; i++) {
    if (!cards[i].classList.contains("hidden")) {
      cards[i].classList.add("hidden");
    }
  }
}


function unhideAllCards() {
  for (let i = 0; i < cards.length; i++) {
    if (cards[i].classList.contains("hidden")) {
      cards[i].classList.remove("hidden");
    }
  }
}


function flipCard(card) {
  card.classList.remove("faceDown");
  if (flippedCards.length === 0) {
    playSound("mapTravel");
  }
  if (!flippedCards.includes(card)) {
    flippedCards.push(card);
  }
}


function checkCard(cardType) {
  if (flippedCards.length === 2) {
    if (flippedCards[0].classList.contains(cardType)) {
      clearFlippedCardsArr();
      playSound("match");
      matches += 1;
      updateScore();
      setTimeout(function() {
        hideCards(cardType);
        checkNextRound();
      }, 500);
    } else {
      clearFlippedCardsArr();
      playSound("mapTravel");
      setTimeout(function() {
        turnCardsBackOver();
      }, 500);
      tries -= 1;
      updateScore();
    }
  }
}


function clearFlippedCardsArr() {
  //used in checkCard
  flippedCards.length = 0;
}


function updateScore() {
  //used in checkCard
  title.innerHTML = "Mario Matching<br>Matches: " + matches + " Tries: " + tries + " Round: " + round;
  if (tries < 1) {
    gameOver();
  }
}


function turnCardsBackOver() {
  //used in checkCard
  for (let i = 0; i < cards.length; i++) {
    if (!cards[i].classList.contains("faceDown")) {
      cards[i].classList.add("faceDown");
    }
  }
}


function gameOver() {
  //stops game once num of tries === 0 checkedin updateScore function
  hideAllCards();
  setTimeout(function() {
    playSound("gameOver");
  }, 1000);
  clearFlippedCardsArr();
  let gameOverScreen = document.createElement("h2");
  gameOverScreen.innerHTML = "GAME OVER<br>CLICK TO PLAY AGAIN";
  gameOverScreen.setAttribute("id", "gameOverScreen");
  gameOverScreen.classList.add("gameOverScreen");
  title.after(gameOverScreen);
  gameOverScreen.addEventListener("click", function() {
    console.log("game over screen clicked");
    restartGame();
  });
}


function restartGame() {
  //user can click on GAME OVER screen to repopulate
  let gameOverScreen = document.getElementById("gameOverScreen");
  gameOverScreen.remove();
  tries = 4;
  matches = 0;
  round = 1;
  reassignCardClasses();
  updateScore();
}


function checkNextRound() {
  //used in checkCard after match - checks to see if game board is cleared then repopulates
  let newRound = true;
  for (let i = 0; i < cards.length; i++) {
    if (!cards[i].classList.contains("hidden")) {
      newRound = false;
    }
  }
  if (newRound) {
    playSound("levelClear");
    tries += 3;
    round += 1;
    reassignCardClasses();
    // unhideAllCards();
    updateScore();
  }
}


//plays sounds...
function playSound(name) {
  var audio = new Audio("sounds/" + name + ".wav");
  audio.play();
}


//debugging helper function - not used in game
function showAllCards() {
  for (let i = 0; i < cards.length; i++) {
    if (cards[i].classList.contains("faceDown")) {
      cards[i].classList.remove("faceDown");
    }
  }
}
