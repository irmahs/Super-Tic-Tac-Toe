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

    if (position) {
        showToast(`You clicked ${planet}, position: ${position}`);
    } else {
        showToast("Unknown button clicked");
    }

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

    playArea(button);
}

function playArea(button) {

    const planet = button.classList[2];
    const position = positionMap.get(planet);

    const totalButtons = document.querySelectorAll("button.game");
    totalButtons.forEach(button => {
        button.disabled = true;
    });

    const playableButtons = document.querySelectorAll(`#${position} button:not(.played)`);
    playableButtons.forEach(button => {
        button.disabled = false;
    });
}

function checkSectionFilled(sectionId) {
    const section = document.getElementById(sectionId);
    const children = section.querySelectorAll("button");

    // Check if all children have the 'played' class
    const allPlayed = Array.from(children).every(button => button.classList.contains('played'));

    // If all children have the 'played' class, add 'filled' to the parent
    if (allPlayed) {
        section.classList.add('filled');
    } else {
        section.classList.remove('filled');
    }

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
    document.getElementById("label").textContent = "Player One Turn";
}