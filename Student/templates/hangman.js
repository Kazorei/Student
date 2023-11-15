const hangmanImage = document.querySelector(".hangman-box img");
const wordDisplay = document.querySelector(".word-display");
const guessesText = document.querySelector(".guesses-text b");
const keyboardDiv = document.querySelector(".keyboard");
const gameModal = document.querySelector(".game-modal");
const playAgainBtn = document.querySelector(".play-again");

let currentWord, correctLetters, wrongGuessCount;
const maxGuesses = 6;

const resetGame = () => {
    correctLetters = [];
    wrongGuessCount = 0;
    hangmanImage.src = `hangman-${wrongGuessCount}.svg`;
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
    wordDisplay.innerHTML = currentWord.split("").map((letter, index) => {
        if (index === 0) {
            correctLetters.push(letter); // Revealing the first letter
            return `<li class="letter guessed">${letter}</li>`;
        } else {
            return '<li class="letter"></li>';
        }
    }).join("");
    keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);
    gameModal.classList.remove("show");
}

const getRandomWord = () => {
    const { word, hint } = wordList[Math.floor(Math.random() * wordList.length)];
    currentWord = word;
    document.querySelector(".hint-text b").innerText = hint;
    resetGame();
}

const gameOver = (isVictory) => {
    setTimeout(() => {
        const modalText = isVictory ? "You found the word:" : "The correct word was:";
        gameModal.querySelector("img").src = `${isVictory ? "victory" : "lost"}.gif`;
        gameModal.querySelector("h4").innerText = isVictory ? "Congrats!" : "Game over!";
        gameModal.querySelector("p").innerHTML = `${modalText} <b>${currentWord}</b>`;
        gameModal.classList.add("show");
    }, 300);
}

const initGame = (button, clickedLetter) => {
    if (wrongGuessCount === maxGuesses) {
        return;
    }

    let found = false;

    [...currentWord].forEach((letter, index) => {
        if (letter === clickedLetter) {
            found = true;
            correctLetters.push(letter);
            const letterElement = wordDisplay.querySelectorAll("li")[index];
            letterElement.innerText = letter;
            letterElement.classList.add("guessed");
        }
    });

    if (!found) {
        wrongGuessCount++;
        hangmanImage.src = `hangman-${wrongGuessCount}.svg`;
    }

    button.disabled = true;
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;

    if (wrongGuessCount === maxGuesses) {
        gameOver(false);
    } else if (correctLetters.length === currentWord.replace(/ /g, '').length) {
        gameOver(true);
    }
}

for (let i = 97; i <= 122; i++) {
    const button = document.createElement("button");
    button.innerText = String.fromCharCode(i);
    keyboardDiv.appendChild(button);
    button.addEventListener("click", e => initGame(e.target, String.fromCharCode(i)));
}

getRandomWord();
playAgainBtn.addEventListener("click", getRandomWord);
