let isPlayerOne = true;
let pink = "#ffb8ee";
let purple = "#d4b8ff";

const positionMap = new Map([
    ["mercury", "top-left"],
    ["jupiter", "middle-left"],
    ["neptune", "bottom-left"],
    ["venus", "top-center"],
    ["sun-moon", "middle-center"],
    ["uranus", "bottom-center"],
    ["mars", "top-right"],
    ["saturn", "middle-right"],
    ["pluto", "bottom-right"]
]);

const winPatterns = [
    [0, 1, 2],  // Row 1
    [3, 4, 5],  // Row 2
    [6, 7, 8],  // Row 3
    [0, 3, 6],  // Column 1
    [1, 4, 7],  // Column 2
    [2, 5, 8],  // Column 3
    [0, 4, 8],  // Diagonal 1
    [2, 4, 6]   // Diagonal 2
];

document.addEventListener("DOMContentLoaded", () => {
    const starContainer = document.createElement("div");
    starContainer.classList.add("stars");
    document.body.appendChild(starContainer);

    const numStars = 500; // Adjust the number of stars
    for (let i = 0; i < numStars; i++) {
        const star = document.createElement("div");
        star.classList.add("star");
        star.style.top = `${Math.random() * 100}vh`;
        star.style.left = `${Math.random() * 100}vw`;
        star.style.animationDelay = `${Math.random() * 3}s`;
        starContainer.appendChild(star);
    }
});

// call initializeWinCheck to set up the observer when the DOM is loaded
document.addEventListener("DOMContentLoaded", initializeWinCheck);

function getPlanetByPosition(position) {
    for (let [planet, val] of positionMap.entries()) {
        if (val === position) {
            return planet;
        }
    }
    return null;
}

function changeButton(button) {
    const buttonColor = getComputedStyle(button).backgroundColor;
    const planet = button.classList[2];
    const position = positionMap.get(planet);
    const playerTurn = document.getElementById("playerTurn");

    if (!button.classList.contains("played")) {
        if (isPlayerOne) {
            button.style.backgroundColor = pink;
            button.classList.add("played"); 
            button.classList.add("pink"); 
            playerTurn.textContent = "Purple's 🔮 Turn";
            playerTurn.style.color = purple;
            isPlayerOne = !isPlayerOne;
        } else {
            button.style.backgroundColor = purple;
            button.classList.add("played");
            button.classList.add("purple"); 
            playerTurn.textContent = "Pink's 🌸 Turn";
            playerTurn.style.color = pink;
            isPlayerOne = !isPlayerOne;
        }   
    }

    const result = checkWinCondtion(button);
    if (result) {
        const position = getSectionId(button);
        const winner = result === "pink" ? "Pink 🌸" : result === "purple" ? "Purple 🔮" : null;
        const winnerColor = result === "pink" ? "#ffb8ee" : result === "purple" ? "#d4b8ff" : null;
        if (winner) {
            showToast(`${winner} wins ${getPlanetByPosition(position)}`);
            document.getElementById(position).style.color = winnerColor;
            document.getElementById(position).classList.add(result);
        } else {
            freePlayArea();
            }
    }
    
    if (checkSectionWon(position)) {
        showToast(planet + " has been conquered! Visit another planet!");
        freePlayArea();
    } else if (checkSectionFilled(position)) {
        showToast(planet + " is full! Visit another planet!");
        freePlayArea();
    } else {
        fixedPlayArea(button);
    }
}

function getSectionId(button) {
    const section = button.closest(".section"); 
    return section ? section.id : null; 
}

function freePlayArea() {
    const playableButtons = document.querySelectorAll(`button:not(.played)`);
    playableButtons.forEach(button => {
        button.disabled = false;
    });
}

function fixedPlayArea(button) {
    const planet = button.classList[2];
    const position = positionMap.get(planet);

    //get all buttons
    const totalButtons = document.querySelectorAll("button.game");
    totalButtons.forEach(button => {
        button.disabled = true;
    });

    const playableButtons = document.querySelectorAll(`#${position} button:not(.played)`);
    playableButtons.forEach(button => {
        button.disabled = false;
    });
}

function checkSectionFilled(position) {
    // get all buttons that haven't been played under position
    const playableButtons = document.querySelectorAll(`#${position} button:not(.played)`);

    // get all buttons under position
    const allButtons = document.querySelectorAll(`#${position} .button-set button`);

    // get all buttons that are played undeer position
    const playedButtons = allButtons.length - playableButtons.length;

    // check if played is equal to all buttons
    return playedButtons == allButtons.length ? document.getElementById(position).classList.add("filled") || true : false;
}

function checkSectionWon(position) {
    return document.getElementById(position).classList.contains("won");
}

function checkWinCondtion(button) {
    // get current position
    const position = getSectionId(button);
    // get all buttons under position
    const allButtons = document.querySelectorAll(`#${position} .button-set button`);
    // check each win pattern
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;

        // get the class of the first button in the pattern
        let color = null;
        if (allButtons[a].classList.contains('pink')) {
            color = 'pink';
        } else if (allButtons[a].classList.contains('purple')) {
            color = 'purple';
        }

        // if the first button has a color and all three buttons have the same color
        if (color && allButtons[b].classList.contains(color) && allButtons[c].classList.contains(color)) {
            const wonSection = document.getElementById(position);
            wonSection.classList.add("won");
            const wonButtons = document.querySelectorAll(`#${position} button:not(.played)`);
            wonButtons.forEach(button => {
                button.disabled = true;
                button.classList.add("played");
            });
            return color; // return 'pink' or 'purple' for winner
        }
    }

    return false;
}

function initializeWinCheck() {
    // add MutationObserver to detect changes in class of sections
    const observer = new MutationObserver(() => {
        // call the checkWinCondtionBig function when any class change is detected
        const result = checkWinCondtionBig();
        const winner = result === "pink" ? "Pink 🌸" : result === "purple" ? "Purple 🔮" : null;
        const winnerColor = result === "pink" ? "#ffb8ee" : result === "purple" ? "#d4b8ff" : null;
        if (checkWinCondtionBig()) {
            showCelebrationToast(winner, winnerColor);
            document.querySelectorAll(".star").forEach(star => {
                star.style.backgroundColor = winnerColor;
            });
            document.querySelectorAll("button:not(#resetButton)").forEach(button => {
                button.disabled = true;
            });
        }
    });

    // observe all sections for class attribute changes
    document.querySelectorAll(".section").forEach(section => {
        observer.observe(section, { attributes: true, attributeFilter: ["class"] });
    });
}

// check winner for big game
function checkWinCondtionBig() {
    const allSections = document.querySelectorAll(".section");
    
    // check each win pattern
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;

        // get the class of the first section in the pattern
        let color = null;
        if (allSections[a].classList.contains('pink')) {
            color = 'pink';
        } else if (allSections[a].classList.contains('purple')) {
            color = 'purple';
        }

        // if the first section has a color and all three sections have the same color
        if (color && allSections[b].classList.contains(color) && allSections[c].classList.contains(color)) {
            return color;
        }
    }

    return false;
}



function showToast(message) {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.background = "black";
    toast.style.color = "white";
    toast.style.padding = "10px 20px";
    toast.style.borderRadius = "5px";
    toast.style.zIndex = "1000";
    
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 2000);
}

function resetBoard() {
    const playerTurn = document.getElementById("playerTurn");
    isPlayerOne = true;
    document.querySelectorAll(".section").forEach(section => {
        section.classList.remove("won");
        section.classList.remove("filled");
        section.classList.remove("purple");
        section.classList.remove("pink");
        section.style.color = "white";
    });
    const buttons = document.querySelectorAll("button:not(#resetButton)");
    buttons.forEach(button => {
        button.style.backgroundColor = "white";
        button.disabled = false;
        button.classList.remove("played");
        button.classList.remove("purple");
        button.classList.remove("pink"); 
    });
    playerTurn.textContent = "Pink's 🌸 Turn";
    playerTurn.style.color = "pink";
}

function showCelebrationToast(winner, winnerColor) {
    // create the celebration toast container
    const toast = document.createElement("div");
    toast.textContent = `${winner} Wins! 🎉🎉`;
    toast.classList.add("celebration-toast");

    // apply inline styles directly to the toast
    toast.style.position = "fixed";
    toast.style.top = "50%";
    toast.style.left = "50%";
    toast.style.transform = "translate(-50%, -50%)";
    toast.style.backgroundColor = winnerColor;
    toast.style.padding = "20px";
    toast.style.fontSize = "2rem";
    toast.style.fontWeight = "bold";
    toast.style.borderRadius = "10px";
    toast.style.boxShadow = "0 0 20px rgba(0, 0, 0, 0.1)";
    toast.style.zIndex = "1000";

    // add the toast to the body
    document.body.appendChild(toast);

     // remove the toast after 5 seconds
    setTimeout(() => {
        toast.remove();
    }, 5000);
}


