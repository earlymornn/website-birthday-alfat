
document.addEventListener("DOMContentLoaded", function () {

    // =====================================
    // BACKGROUND MUSIC SYSTEM
    // =====================================

    const backgroundMusic = document.getElementById("backgroundMusic");
    const pageFrame = document.querySelector(".persistent-frame");

    if (backgroundMusic && pageFrame) {

        function sendMusicStatus() {
            pageFrame.contentWindow.postMessage(
                {
                    type: "MUSIC_STATUS",
                    playing: !backgroundMusic.paused
                },
                window.location.origin
            );
        }

        window.addEventListener("message", async function (event) {

            if (event.origin !== window.location.origin) return;

            if (event.data.type === "START_MUSIC") {
                try {
                    await backgroundMusic.play();
                    sendMusicStatus();
                } catch (error) {
                    console.log("Musik gagal diputar:", error);
                }
            }

            if (event.data.type === "MUSIC_GET_STATUS") {
                sendMusicStatus();
            }

        });

        backgroundMusic.addEventListener("play", sendMusicStatus);
        backgroundMusic.addEventListener("pause", sendMusicStatus);
        pageFrame.addEventListener("load", sendMusicStatus);
    }


    // =====================================
    // MOCHI ELEMENTS
    // =====================================

    const mochiCharacter = document.getElementById("mochiCharacter");
    const mochiBubble = document.getElementById("mochiBubble");
    const mochiMessage = document.getElementById("mochiMessage");

    const openMochiRoom = document.getElementById("openMochiRoom");
    const closeMochiRoom = document.getElementById("closeMochiRoom");
    const mochiRoom = document.getElementById("mochiRoom");

    const fishToy = document.getElementById("fishToy");
    const roomMessage = document.getElementById("roomMessage");


    // =====================================
    // MOCHI DIALOGUES
    // =====================================

    const mochiMessages = [
        "Hiii! I'm Mochi ♡",
        "Are you here to visit me?",
        "You're my favorite human!",
        "Meow meow~ ♡",
        "Don't forget to smile today!",
        "I have a little secret...",
        "Alfat is very special, right? ♡",
        "Can I have some treats?",
        "Stay a little longer, please ♡",
        "Sending you tiny hugs!"
    ];

    const mochiThoughts = [
        "I wonder where Alfat is... ♡",
        "It's so cozy here!",
        "Can I have a little snack?",
        "Meow~ I love this place!",
        "I wish today could last forever.",
        "Sending hugs to Alfat ♡",
        "The stars are pretty tonight...",
        "Don't forget to take a rest!"
    ];

    let messageIndex = 0;
    let isSleeping = false;

    let messageTimer = null;
    let sleepTimer = null;
    let thoughtTimer = null;
    let clickTimer = null;


    // =====================================
    // SHOW MOCHI MESSAGE
    // =====================================

    function showMochiMessage(message, duration = 3500) {

        if (!mochiBubble || !mochiMessage) return;

        clearTimeout(messageTimer);

        mochiMessage.textContent = message;

        mochiBubble.classList.add("show");
        mochiBubble.classList.remove("sleeping-message");

        messageTimer = setTimeout(function () {

            if (!isSleeping) {
                mochiBubble.classList.remove("show");
                mochiBubble.classList.remove("thought");
            }

        }, duration);
    }


    // =====================================
    // HEART EFFECT
    // =====================================

    function createHeart() {

        if (!mochiCharacter) return;

        const heart = document.createElement("span");

        heart.className = "mochi-heart";
        heart.textContent = "♡";

        const rect = mochiCharacter.getBoundingClientRect();

        heart.style.left = (rect.left + rect.width / 2) + "px";
        heart.style.top = (rect.top - 10) + "px";
        heart.style.position = "fixed";

        document.body.appendChild(heart);

        setTimeout(function () {
            heart.remove();
        }, 1000);
    }


    // =====================================
    // MOCHI HAPPY ANIMATION
    // =====================================

    function makeMochiHappy() {

        if (!mochiCharacter) return;

        mochiCharacter.classList.remove("sleeping");
        mochiCharacter.classList.remove("playing");
        mochiCharacter.classList.remove("happy");
        mochiCharacter.classList.remove("petted");

        isSleeping = false;

        void mochiCharacter.offsetWidth;

        mochiCharacter.classList.add("happy");

        setTimeout(function () {
            mochiCharacter.classList.remove("happy");
        }, 700);

        createHeart();
    }


    // =====================================
    // WAKE UP MOCHI
    // =====================================

    function wakeUpMochi() {

        if (!mochiCharacter) return;

        isSleeping = false;

        mochiCharacter.classList.remove("sleeping");

        if (mochiBubble) {
            mochiBubble.classList.remove("sleeping-message");
        }

        showMochiMessage("Good morning! I missed you ♡");

        makeMochiHappy();

        startSleepTimer();
        startRandomThoughtTimer();
    }


    // =====================================
    // NORMAL CLICK & DOUBLE CLICK
    // =====================================

    if (mochiCharacter) {

        mochiCharacter.addEventListener("click", function () {

            if (isSleeping) {
                clearTimeout(clickTimer);
                wakeUpMochi();
                return;
            }

            // Delay single click to detect double click
            clearTimeout(clickTimer);

            clickTimer = setTimeout(function () {

                messageIndex++;

                if (messageIndex >= mochiMessages.length) {
                    messageIndex = 0;
                }

                showMochiMessage(mochiMessages[messageIndex]);

                makeMochiHappy();

                startSleepTimer();
                startRandomThoughtTimer();

            }, 250);

        });


        // Double click = pet Mochi
        mochiCharacter.addEventListener("dblclick", function (event) {

            event.preventDefault();

            clearTimeout(clickTimer);

            if (isSleeping) {
                wakeUpMochi();
                return;
            }

            mochiCharacter.classList.remove("petted");

            void mochiCharacter.offsetWidth;

            mochiCharacter.classList.add("petted");

            showMochiMessage(
                "Purrr... I love your pets! ♡",
                4000
            );

            createHeart();

            setTimeout(function () {
                mochiCharacter.classList.remove("petted");
            }, 600);

            startSleepTimer();
            startRandomThoughtTimer();

        });

    }


    // =====================================
    // OPEN MOCHI ROOM
    // =====================================

    if (openMochiRoom && mochiRoom) {

        openMochiRoom.addEventListener("click", function () {

            mochiRoom.classList.add("open");

            if (roomMessage) {
                roomMessage.textContent = "Welcome back! I missed you ♡";
            }

        });

    }


    // =====================================
    // CLOSE MOCHI ROOM
    // =====================================

    if (closeMochiRoom && mochiRoom) {

        closeMochiRoom.addEventListener("click", function () {

            mochiRoom.classList.remove("open");

        });

    }


    // =====================================
    // PLAY WITH FISH
    // =====================================

    if (fishToy) {

        fishToy.addEventListener("click", function () {

            if (roomMessage) {
                roomMessage.textContent = "YAY! FISHY TIME!! ♡";
            }

            if (mochiCharacter) {

                mochiCharacter.classList.remove("sleeping");
                mochiCharacter.classList.remove("happy");
                mochiCharacter.classList.add("playing");

                isSleeping = false;

                setTimeout(function () {

                    mochiCharacter.classList.remove("playing");
                    mochiCharacter.classList.add("happy");

                }, 1200);

                setTimeout(function () {

                    mochiCharacter.classList.remove("happy");

                }, 1900);

            }

            showMochiMessage("YAY! Let's play together! ♡");

            createHeart();

            startSleepTimer();
            startRandomThoughtTimer();

        });

    }


    // =====================================
    // MOCHI SLEEP MODE
    // =====================================

    function makeMochiSleep() {

        if (!mochiCharacter) return;

        isSleeping = true;

        mochiCharacter.classList.remove("happy");
        mochiCharacter.classList.remove("playing");
        mochiCharacter.classList.remove("petted");

        mochiCharacter.classList.add("sleeping");

        clearTimeout(messageTimer);
        clearTimeout(thoughtTimer);

        if (mochiBubble && mochiMessage) {

            mochiMessage.textContent = "Zzz... good night ♡";

            mochiBubble.classList.add("show");
            mochiBubble.classList.add("sleeping-message");
            mochiBubble.classList.remove("thought");

        }

        if (roomMessage) {
            roomMessage.textContent = "Mochi is sleeping... Zzz ♡";
        }

    }


    // =====================================
    // SLEEP TIMER
    // =====================================

    function startSleepTimer() {

        clearTimeout(sleepTimer);

        sleepTimer = setTimeout(function () {

            makeMochiSleep();

        }, 60000);

    }


    // =====================================
    // RANDOM THOUGHTS
    // =====================================

    function showRandomThought() {

        if (isSleeping) return;

        if (mochiRoom && mochiRoom.classList.contains("open")) {
            startRandomThoughtTimer();
            return;
        }

        const randomIndex = Math.floor(
            Math.random() * mochiThoughts.length
        );

        showMochiMessage(
            mochiThoughts[randomIndex],
            4500
        );

        if (mochiBubble) {
            mochiBubble.classList.add("thought");
        }

        startRandomThoughtTimer();
    }


    // =====================================
    // RANDOM THOUGHT TIMER
    // =====================================

    function startRandomThoughtTimer() {

        clearTimeout(thoughtTimer);

        thoughtTimer = setTimeout(function () {

            showRandomThought();

        }, 20000);

    }


    // =====================================
    // START MOCHI ACTIVITIES
    // =====================================

    startSleepTimer();
    startRandomThoughtTimer();


});
