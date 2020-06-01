let canvas, canvasContext;
let ballX = 50;
let ballY = 50;
let ballSpeedX = 15;
let ballSpeedY = 5;

let player1Score = 0;
let player2Score = 0;
const WINNING_SCORE = 5;

let showingWinningScreen = false;
let gameIsPaused = false;
let thereIsAlreadyGame = false;
let isPlayerToEngage = false;
let isComputerToEngage = false;

let paddle1Y = 250;
let paddle2Y = 250;
const PADDLE_THICKNESS = 10;
const PADDLE_HEIGHT = 100; 

window.onload = function() {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');

    let framesPerSecond = 30;

    document.querySelector('button').addEventListener('click', function() {
        if (!thereIsAlreadyGame) {
            thereIsAlreadyGame = true;
            setInterval(function() {
                moveEverything();
                drawEverything();
            }, 1000 / framesPerSecond);
        }
    })

    canvas.addEventListener('mousemove', function(event) {
        let mousePos = calculateMousePosition(event);

        if (!gameIsPaused) {
            paddle1Y = mousePos.y - PADDLE_HEIGHT / 2;
        }
    })

    canvas.addEventListener('mousedown', handleMouseClick);
}

function handleMouseClick(event) {
    if (showingWinningScreen) {
        player1Score = 0;
        player2Score = 0;
        showingWinningScreen = false;
    } else {
        if (!isComputerToEngage) {
            gameIsPaused = !gameIsPaused;
        }

        if (isPlayerToEngage) {
            isPlayerToEngage = false;
        }
    }
}

function ballReset() {
    if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
        showingWinningScreen = true;
    }
    
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
}

function calculateMousePosition(event) {
    let rect = canvas.getBoundingClientRect();
    let root = document.documentElement;
    let mouseX = event.clientX - rect.left - root.scrollLeft;
    let mouseY = event.clientY - rect.top - root.scrollTop;

    return {
        x: mouseX,
        y: mouseY
    };
}

function computerMovement() {
    let paddle2YCenter = paddle2Y + PADDLE_HEIGHT / 2; 

    if (paddle2YCenter < ballY - 35) {
        paddle2Y += Math.floor(Math.random() * (12 - 6 + 1)) + 6;
    } else if (paddle2YCenter > ballY + 35) {
        paddle2Y -= Math.floor(Math.random() * (12 - 6 + 1)) + 6;
    }
}

function moveEverything() {
    if (showingWinningScreen) {
        return;
    }

    if (gameIsPaused) {
        return;
    }

    computerMovement();

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballX < 0) {
        if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
            ballSpeedX = -ballSpeedX;

            let deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);

            ballSpeedY = deltaY * 0.35;
        } else {
            player2Score++;

            paddle1Y = 250;
            paddle2Y = 250;

            isPlayerToEngage = true;
        }
    }
    if (ballX > canvas.width) {
        if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
            ballSpeedX = -ballSpeedX;

            let deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);

            ballSpeedY = deltaY * 0.35;
        } else {
            player1Score++;

            paddle1Y = 250;
            paddle2Y = 250;
     
            isComputerToEngage = true;
        }
    }
    if (ballY < 0) {
        ballSpeedY = -ballSpeedY;
    }
    if (ballY > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }
}

function drawNet() {
    for (let i = 10; i < canvas.height; i+=40) {
        colorRect(canvas.width / 2 - 1, i, 2, 20, "#fff");
    }
}

function drawEverything() {
    // Initialisation du terrain de jeu
    colorRect(0, 0, canvas.width, canvas.height, "#02cbff");
    canvas.style.border = "20px solid #019bcb";

    if (showingWinningScreen) {
        canvasContext.fillStyle = "#fff";
        canvasContext.font = "bold 30px sans-serif";
        canvasContext.textAlign = "center";
        canvasContext.textBaseline = "middle";

        let centerX = canvas.width / 2;

        if (player1Score > player2Score) {
            canvasContext.fillText("Félicitations !", centerX, 200);
            canvasContext.fillText("Vous avez gagné 👍", centerX, 300);
        } else {
            canvasContext.fillText("L'ordinateur a gagné ! 😭", centerX, 200);
        }
        canvasContext.fillText("Cliquez pour continuer.", centerX, 500);
        return;
    }

    if (isPlayerToEngage) {
        gameIsPaused = true;
        let centerX = canvas.width / 2;
    
        canvasContext.fillStyle = "#fff";
        canvasContext.font = "bold 30px sans-serif";
        canvasContext.textAlign = "center";
        canvasContext.textBaseline = "middle";
        canvasContext.fillText("Faites un clic gauche pour lancer la balle.", centerX, canvas.height / 3);
        ballSpeedX = 15;
    
        ballReset();
    }

    if (isComputerToEngage) {
        gameIsPaused = true;
        let centerX = canvas.width / 2;

        canvasContext.fillStyle = "#fff";
        canvasContext.font = "bold 30px sans-serif";
        canvasContext.textAlign = "center";
        canvasContext.textBaseline = "middle";
        canvasContext.fillText("Attention, l'ordinateur va lancer la balle !", centerX, canvas.height / 3);

        setTimeout(function() {
            isComputerToEngage = false;
            gameIsPaused = false;
        }, 3000)

        ballSpeedX = -15;
        ballReset();
    }

    // Initialisation de la ligne centrale
    drawNet();

    // Initialisation du paddle du joueur
    colorRect(0, paddle1Y, PADDLE_THICKNESS, 100, "#1d344b");

    // Initialisation du paddle de l'IA
    colorRect(canvas.width, paddle2Y, -PADDLE_THICKNESS, 100, "#1d344b");

    // Initialisation de la balle
    colorCircle(ballX, ballY, 10, "#e2ec3d");

    canvasContext.font = "bold 30px sans-serif";
    canvasContext.fillStyle = "#fff";
    canvasContext.fillText(player1Score, canvas.width / 4, 100);
    canvasContext.fillText(player2Score, (canvas.width / 4) * 3, 100);
}

function colorCircle(centerX, centerY, radius, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);    // arc(positionX du centre de l'arc, positionY du centre de l'arc, rayon, angleDépart, angleFin, sensAntiHoraire)
    canvasContext.fill();
}

function colorRect(leftX, topY, width, height, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height);
}