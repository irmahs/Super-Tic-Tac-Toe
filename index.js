let isPlayerOne = true;

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

function changeButton(button) {
    const buttonColor = getComputedStyle(button).backgroundColor;
    const planet = button.classList[2];
    const position = positionMap.get(planet);

    if (!button.classList.contains("played")) {
        if (isPlayerOne) {
            button.style.backgroundColor = "#ffb8ee";
            button.classList.add("played"); // Adds a class
            document.getElementById("playerTurn").textContent = "Player Two Turn";
            isPlayerOne = !isPlayerOne;
        } else {
            button.style.backgroundColor = "#d4b8ff";
            button.classList.add("played"); // Adds a class
            document.getElementById("playerTurn").textContent = "Player One Turn";
            isPlayerOne = !isPlayerOne;
        }
    }


    if (checkSectionFilled(position)) {
        showToast(planet + " is filled! Visit another planet!");
        freePlayArea();
    } else {
        fixedPlayArea(button);
    }
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

function checkSectionWon(position) {

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
    isPlayerOne = true;
    const buttons = document.querySelectorAll("button");
    buttons.forEach(button => {
        button.style.backgroundColor = "white";
        button.disabled = false;
        button.classList.remove("played"); // Removes a class
    });
    document.getElementById("playerTurn").textContent = "Player One Turn";
}