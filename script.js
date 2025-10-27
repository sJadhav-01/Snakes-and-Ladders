// players info card
let noOfPlayers = null;
while (noOfPlayers < 2) {
  noOfPlayers = prompt("enter number of players playing : ");
  if (noOfPlayers < 2) {
    alert("Single player can not play the game");
  }
}

// snakes and their positions
let snakes = {
  // snake1: [17, 16, 6, 7],
  snake1: [17, 7],
  snake2: [54, 34],
  snake3: [62, 19],
  snake4: [64, 60],
  snake5: [87, 36],
  snake6: [93, 73],
  snake7: [95, 75],
  snake8: [98, 79],
};
let snakesAt = [];
for (let snake in snakes) {
  snakesAt.push(snakes[snake][0]);
}
console.log(snakesAt);

// ladders and their positions

// let ladders = {
//   ladder1: [1, 19, 22, 23, 38],
//   ladder2: [4, 5, 6, 14],
//   ladder3: [9, 12, 30, 31],
//   ladder4: [21, 40, 42],
//   ladder5: [28, 34, 47, 55, 65, 76, 84],
//   ladder6: [51, 52, 53, 67],
//   ladder7: [72, 90, 91],
//   ladder8: [80, 81, 99],
// };

let ladders = {
  ladder1: [1, 38],
  ladder2: [4, 14],
  ladder3: [9, 31],
  ladder4: [21, 42],
  ladder5: [28, 84],
  ladder6: [51, 67],
  ladder7: [72, 91],
  ladder8: [80, 99],
};

let laddersAt = [];
for (let ladder in ladders) {
  laddersAt.push(ladders[ladder][0]);
}
console.log(laddersAt);

// creation of sheet with the blocks from 1-100

let sheet = document.getElementById("sheet");
let toRight = true;

for (let i = 0; i <= 9; i++) {
  let row = document.createElement("div");
  row.classList.add("row");
  row.setAttribute("id", `${i + 1}`);
  //   row.innerText = `${i+1}`;
  sheet.prepend(row);
  for (let j = 1; j <= 10; j++) {
    let block = document.createElement("div");
    block.classList.add("block");
    block.setAttribute("id", `block-${i * 10 + j}`);
    if (snakesAt.includes(i * 10 + j)) {
      // block.style.backgroundColor = "Red";
      // block.innerText = `${i * 10 + j} - snake here`;
    } else if (laddersAt.includes(i * 10 + j)) {
      // block.style.backgroundColor = "Green";
      // block.innerText = `${i * 10 + j} - Ladder here`;
    }
    // } else {
    //   block.style.backgroundColor = "white";
    // }
    block.style.color = "black";
    // block.innerText = `${i * 10 + j}`;
    if (toRight) {
      row.append(block);
    } else {
      row.prepend(block);
    }
  }

  toRight = !toRight;
}

// starting position of players

let startBlock = document.getElementById("block-1");

for (let i = 1; i <= noOfPlayers; i++) {
  let player = document.createElement("div");
  player.setAttribute("id", `player-${i}`);
  player.classList.add("player");
  // player.innerText = `${i}`;
  startBlock.append(player);
}

let playersInfoCard = document.querySelector(".players-info-card");

for (let i = 1; i <= noOfPlayers; i++) {
  let playerInfo = document.createElement("div");
  playerInfo.setAttribute("id", `player-${i}-info`);
  playerInfo.classList.add("player-info");
  playerInfo.innerText = `player-${i}-info`;
  playersInfoCard.append(playerInfo);
}

// ckecking for winner to end the game
let winner = null;
let endBlock = document.getElementById("block-100");
function checkWinner() {
  if (endBlock && endBlock.children.length > 0) {
    //endBlock.childer will always return true even if it has no child node
    winner = endBlock.children[0].getAttribute("id");
  }
  return winner;
}

// playing game
// A new array to track each player's position
let playersPositions = [];
for (let i = 0; i < noOfPlayers; i++) {
  playersPositions.push(1); // Initialize each player at block 1
}

// delay function to move player slowly from blocks
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// moving player without landing on snake or ladder
async function movePlayerWithDelay(oldPosition, newPosition, playerElement) {
  // Loop through each block from the old position to the new position
  for (let i = oldPosition + 1; i <= newPosition; i++) {
    const currentBlock = document.getElementById(`block-${i}`);

    // Wait for a short delay before moving to the next block
    await delay(200); // 200ms delay for each step

    // Append the player element to the current block
    currentBlock.append(playerElement);
  }
}

// moving player with landing on snake or ladder
async function jumpPlayerWithDelay(array, playerElement) {
  // Loop through each block from the old position to the new position
  for (let i of array) {
    const currentBlock = document.getElementById(`block-${i}`);

    // Wait for a short delay before moving to the next block
    await delay(200); // 200ms delay for each step

    // Append the player element to the current block
    currentBlock.append(playerElement);
  }
}

// A new variable to track whose turn it is
let currentPlayerTurn = 0;

const playgame = (diceValue) => {
  // Determine the current player
  let currentPlayer = currentPlayerTurn + 1;
  let oldPosition = playersPositions[currentPlayerTurn];
  let newPosition = oldPosition + diceValue;
  let ladderAt = null;
  let snakeAt = null;

  // Find the player's current element
  const playerInfo = document.getElementById(`player-${currentPlayer}-info`);
  const playerElement = document.getElementById(`player-${currentPlayer}`);

  // Check for "overflow" beyond block 100
  if (newPosition > 100) {
    newPosition = oldPosition;
    playerInfo.innerText = `Player ${currentPlayer} needs ${
      100 - oldPosition
    } to win. Stay put!`;
  }

  // Check for snakes and ladders
  if (snakesAt.includes(newPosition)) {
    for (let snake in snakes) {
      if (snakes[snake][0] === newPosition) {
        snakeAt = newPosition;
        newPosition = snakes[snake].at(-1);
        console.log(
          `Player ${currentPlayer} landed on a snake! Moving to ${newPosition}`
        );
        // Update the player info display
        playerInfo.innerText = `Player ${currentPlayer} landed on a snake! Moving to ${newPosition}`;
        let snakeRank = snakesAt.indexOf(snakeAt);
        let snakeArray = snakes[`snake${snakeRank + 1}`];
        jumpPlayerWithDelay(snakeArray, playerElement);
        break; // Exit the loop once the snake is found
      }
    }
  } else if (laddersAt.includes(newPosition)) {
    for (let ladder in ladders) {
      if (ladders[ladder][0] === newPosition) {
        ladderAt = newPosition;
        newPosition = ladders[ladder].at(-1);
        console.log(
          `Player ${currentPlayer} found a ladder! Moving to ${newPosition}`
        );
        // Update the player info display
        playerInfo.innerText = `Player ${currentPlayer} found a ladder! Moving to ${newPosition}`;
        let ladderRank = laddersAt.indexOf(ladderAt);
        let ladderArray = ladders[`ladder${ladderRank + 1}`];
        jumpPlayerWithDelay(ladderArray, playerElement);
        break; // Exit the loop once the ladder is found
      }
    }
  } else {
    // Update the player info display
    // const playerInfo = document.getElementById(`player-${currentPlayer}-info`);
    playerInfo.innerText = `Player ${currentPlayer} is at ${newPosition}`;
    movePlayerWithDelay(oldPosition, newPosition, playerElement);
  }

  // Update player position and move the visual element
  playersPositions[currentPlayerTurn] = newPosition;

  // Check for winner
  if (newPosition === 100) {
    winner = `player-${currentPlayer}`;
    playerInfo.innerText = `Player ${currentPlayer} WINS!`;
    return; // End the function (and the game)
  }

  // Move to the next player's turn
  currentPlayerTurn = (currentPlayerTurn + 1) % noOfPlayers;
};

// get dice number function

function rollDice() {
  const diceValue = Math.floor(Math.random() * 6) + 1;
  document.getElementById("current-dice-value").innerText = `${diceValue}`;
  playgame(diceValue);
}

let rollDiceBtn = document.getElementById("roll-dice");
rollDiceBtn.addEventListener("click", (evt) => {
  rollDice();
});
