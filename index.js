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

function changeButton(button) {
    const buttonColor = getComputedStyle(button).backgroundColor;
    const planet = button.classList[2];
    const position = positionMap.get(planet);
    const playerTurn = document.getElementById("playerTurn");

    if (!button.classList.contains("played")) {
        if (isPlayerOne) {
            button.style.backgroundColor = pink;
            button.classList.add("played"); // Adds a class
            button.classList.add("pink"); // Adds a class
            playerTurn.textContent = "Purple's Turn";
            playerTurn.style.color = purple;
            isPlayerOne = !isPlayerOne;
        } else {
            button.style.backgroundColor = purple;
            button.classList.add("played"); // Adds a class
            button.classList.add("purple"); // Adds a class
            playerTurn.textContent = "Pink's Turn";
            playerTurn.style.color = pink;
            isPlayerOne = !isPlayerOne;
        }   
    }

    const result = checkSectionWon(button);
    if (result) {
        if (result == "pink") {
            showToast("Pink wins");
        }
        if (result == "purple") {
            showToast("Purple wins");
        }
    }

    if (checkSectionFilled(position)) {
        showToast(planet + " is filled! Visit another planet!");
        freePlayArea();
      } else {
        fixedPlayArea(button);
      }
}

function getSectionId(button) {
    const section = button.closest(".section"); // Find closest parent with class 'section'
    return section ? section.id : null; // Return the ID or null if not found
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
    
    showToast("position " + position + " playable " + playableButtons.length + " played " + playedButtons);

    // check if played is equal to all buttons
    return playedButtons == allButtons.length;
}

function checkSectionWon(button) {
    // get current position
    const position = getSectionId(button);
    // get all buttons under position
    const allButtons = document.querySelectorAll(`#${position} .button-set button`);
    // Check each win pattern
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;

        // Get the class of the first button in the pattern
        let color = null;
        if (allButtons[a].classList.contains('pink')) {
            color = 'pink';
        } else if (allButtons[a].classList.contains('purple')) {
            color = 'purple';
        }

        // If the first button has a color and all three buttons have the same color
        if (color &&
            allButtons[b].classList.contains(color) &&
            allButtons[c].classList.contains(color)) {
            return color; // Return 'pink' or 'purple' indicating the winner
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
    const buttons = document.querySelectorAll("button");
    buttons.forEach(button => {
        button.style.backgroundColor = "white";
        button.disabled = false;
        button.classList.remove("played");// Removes a class
        button.classList.remove("purple");
        button.classList.remove("pink"); 
    });
    playerTurn.textContent = "Pink's Turn";
    playerTurn.style.color = pink;
}