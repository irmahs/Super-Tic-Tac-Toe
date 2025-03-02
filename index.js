let isPlayerOne = true;

function changeButton(button) {
    const buttonColor = getComputedStyle(button).backgroundColor;
    if (!button.disabled && (buttonColor === 'rgb(255, 255, 255)')) {
        if (isPlayerOne) {
            button.style.backgroundColor = "red";
            button.disabled = true;
            document.getElementById("label").textContent = "Player Two Turn";
            isPlayerOne = !isPlayerOne;
        } else {
            button.style.backgroundColor = "blue";
            button.disabled = true;
            document.getElementById("label").textContent = "Player One Turn";
            isPlayerOne = !isPlayerOne;
        }
        if (button.classList.contains('left')) {
            const leftButtons = document.querySelectorAll('.left');
            leftButtons.forEach(button => {
            button.disabled = true;
        });
        const rightButtons = document.querySelectorAll('.right');
            rightButtons.forEach(button => {
                const isWhite = getComputedStyle(button).backgroundColor == 'rgb(255, 255, 255)';
        if (isWhite) {
            button.disabled = false;
        }
        });
        } else if (button.classList.contains('right')) {
            const rightButtons = document.querySelectorAll('.right');
            rightButtons.forEach(button => {
            button.disabled = true;
        });
        const leftButtons = document.querySelectorAll('.left');
        leftButtons.forEach(button => {
                const isWhite = getComputedStyle(button).backgroundColor == 'rgb(255, 255, 255)';
        if (isWhite) {
            button.disabled = false;
        }
        });
        }
    }
}

function resetBoard() {
    isPlayerOne = true;
    const buttons = document.querySelectorAll("button");
    buttons.forEach(button => {
        button.style.backgroundColor = "white";
        button.disabled = false;
    });
    document.getElementById("label").textContent = "Player One Turn";
}