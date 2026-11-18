
document.addEventListener("DOMContentLoaded", function () {

    const gameBoard = document.getElementById("gameBoard");
    const player = document.getElementById("gamePlayer");

    const scoreDisplay = document.getElementById("score");
    const timerDisplay = document.getElementById("timer");

    const startScreen = document.getElementById("gameStartScreen");
    const startButton = document.getElementById("startGameBtn");

    const resultScreen = document.getElementById("gameResult");
    const resultTitle = document.getElementById("resultTitle");
    const resultDescription = document.getElementById("resultDescription");
    const resultIcon = document.getElementById("resultIcon");
    const restartButton = document.getElementById("restartGameBtn");

    const leftButton = document.getElementById("moveLeft");
    const rightButton = document.getElementById("moveRight");

    // =====================================
    // GAME SETTINGS
    // =====================================

    const TARGET_SCORE = 15;
    const GAME_DURATION = 30;
    const PLAYER_SPEED = 6;

    let score = 0;
    let timeLeft = GAME_DURATION;

    let playerX = 0;
    let moveLeft = false;
    let moveRight = false;

    let gameRunning = false;
    let gameInterval = null;
    let timerInterval = null;
    let spawnInterval = null;
    let animationFrame = null;

    let hearts = [];

    // =====================================
    // INITIAL POSITION
    // =====================================

    function setInitialPosition() {

        playerX = (gameBoard.clientWidth - player.offsetWidth) / 2;

        player.style.left = playerX + "px";
        player.style.transform = "none";

    }

    setInitialPosition();

    window.addEventListener("resize", function () {

        if (!gameRunning) {
            setInitialPosition();
        } else {
            playerX = Math.max(
                0,
                Math.min(
                    playerX,
                    gameBoard.clientWidth - player.offsetWidth
                )
            );
        }

    });

    // =====================================
    // START GAME
    // =====================================

    startButton.addEventListener("click", startGame);
    restartButton.addEventListener("click", startGame);

    function startGame() {

        clearAllIntervals();
        removeAllHearts();

        score = 0;
        timeLeft = GAME_DURATION;

        moveLeft = false;
        moveRight = false;

        scoreDisplay.textContent = score;
        timerDisplay.textContent = timeLeft;

        startScreen.style.display = "none";
        resultScreen.classList.remove("show");

        gameRunning = true;

        setInitialPosition();

        spawnInterval = setInterval(createHeart, 750);

        timerInterval = setInterval(function () {

            timeLeft--;

            timerDisplay.textContent = timeLeft;

            if (timeLeft <= 0) {
                endGame();
            }

        }, 1000);

        animationFrame = requestAnimationFrame(gameLoop);

    }

    // =====================================
    // PLAYER MOVEMENT
    // =====================================

    function updatePlayer() {

        if (moveLeft) {
            playerX -= PLAYER_SPEED;
        }

        if (moveRight) {
            playerX += PLAYER_SPEED;
        }

        const maxX = gameBoard.clientWidth - player.offsetWidth;

        playerX = Math.max(0, Math.min(playerX, maxX));

        player.style.left = playerX + "px";

    }

    // Keyboard controls

    document.addEventListener("keydown", function (event) {

        if (!gameRunning) return;

        if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
            moveLeft = true;
            event.preventDefault();
        }

        if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
            moveRight = true;
            event.preventDefault();
        }

    });

    document.addEventListener("keyup", function (event) {

        if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
            moveLeft = false;
        }

        if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
            moveRight = false;
        }

    });

    // Mobile buttons

    function holdButton(button, direction) {

        button.addEventListener("pointerdown", function (event) {

            if (!gameRunning) return;

            event.preventDefault();

            if (direction === "left") {
                moveLeft = true;
            } else {
                moveRight = true;
            }

        });

        button.addEventListener("pointerup", release);
        button.addEventListener("pointerleave", release);
        button.addEventListener("pointercancel", release);

        function release() {

            if (direction === "left") {
                moveLeft = false;
            } else {
                moveRight = false;
            }

        }

    }

    holdButton(leftButton, "left");
    holdButton(rightButton, "right");

    // =====================================
    // CREATE FALLING HEARTS
    // =====================================

    function createHeart() {

        if (!gameRunning) return;

        const heart = document.createElement("div");

        heart.classList.add("falling-heart");
        heart.textContent = Math.random() > 0.5 ? "♡" : "♥";

        const maxX = gameBoard.clientWidth - 30;

        heart.style.left = Math.random() * maxX + "px";

        gameBoard.appendChild(heart);

        hearts.push({
            element: heart,
            x: parseFloat(heart.style.left),
            y: -30,
            speed: 2 + Math.random() * 2
        });

    }

    // =====================================
    // GAME LOOP
    // =====================================

    function gameLoop() {

        if (!gameRunning) return;

        updatePlayer();
        updateHearts();

        animationFrame = requestAnimationFrame(gameLoop);

    }

    // =====================================
    // UPDATE FALLING HEARTS
    // =====================================

    function updateHearts() {

        const playerRect = player.getBoundingClientRect();

        hearts.forEach(function (heart, index) {

            heart.y += heart.speed;

            heart.element.style.top = heart.y + "px";

            const heartRect = heart.element.getBoundingClientRect();

            // Collision detection

            const collision =
                heartRect.left < playerRect.right &&
                heartRect.right > playerRect.left &&
                heartRect.top < playerRect.bottom &&
                heartRect.bottom > playerRect.top;

            if (collision) {

                collectHeart(index);

            } else if (heart.y > gameBoard.clientHeight) {

                removeHeart(index);

            }

        });

    }

    // =====================================
    // COLLECT HEART
    // =====================================

    function collectHeart(index) {

        const heart = hearts[index];

        if (!heart) return;

        heart.element.remove();

        hearts.splice(index, 1);

        score++;

        scoreDisplay.textContent = score;

        if (score >= TARGET_SCORE) {
            endGame();
        }

    }

    // =====================================
    // REMOVE HEART
    // =====================================

    function removeHeart(index) {

        if (!hearts[index]) return;

        hearts[index].element.remove();

        hearts.splice(index, 1);

    }

    function removeAllHearts() {

        hearts.forEach(function (heart) {
            heart.element.remove();
        });

        hearts = [];

        gameBoard.querySelectorAll(".falling-heart").forEach(function (heart) {
            heart.remove();
        });

    }

    // =====================================
    // END GAME
    // =====================================

    function endGame() {

        if (!gameRunning) return;

        gameRunning = false;

        clearAllIntervals();

        cancelAnimationFrame(animationFrame);

        moveLeft = false;
        moveRight = false;

        removeAllHearts();

        resultScreen.classList.add("show");

        if (score >= TARGET_SCORE) {

            resultIcon.textContent = "♥";
            resultTitle.textContent = "You did it, Alfat!";

            resultDescription.textContent =
                "Mochi is so proud of you! You collected " +
                score +
                " hearts. And here's a little reminder: you are loved more than you know. Happy birthday, my favorite person. ♡";

        } else {

            resultIcon.textContent = "♡";
            resultTitle.textContent = "A little more love!";

            resultDescription.textContent =
                "You collected " +
                score +
                " hearts. Don't give up, Alfat! Mochi still has more hearts waiting for you.";

        }

        restartButton.textContent = "PLAY AGAIN ↻";

    }

    // =====================================
    // CLEAR INTERVALS
    // =====================================

    function clearAllIntervals() {

        clearInterval(gameInterval);
        clearInterval(timerInterval);
        clearInterval(spawnInterval);

        gameInterval = null;
        timerInterval = null;
        spawnInterval = null;

        if (animationFrame !== null) {
            cancelAnimationFrame(animationFrame);
            animationFrame = null;
        }

    }

});
