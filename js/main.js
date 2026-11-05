document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // BACKGROUND MUSIC
    // =========================

    const music = document.getElementById("backgroundMusic");
    const musicToggle = document.getElementById("musicToggle");

    if (music && musicToggle) {
        music.volume = 0.3;

        musicToggle.addEventListener("click", function () {
            if (music.paused) {
                music.play()
                    .then(function () {
                        musicToggle.textContent = "♫ MUSIC ON";
                    })
                    .catch(function () {
                        musicToggle.textContent = "♫ MUSIC OFF";
                    });
            } else {
                music.pause();
                musicToggle.textContent = "♫ MUSIC OFF";
            }
        });
    }


    // =========================
    // MEMORIES PHOTO VIEWER
    // =========================

    const photoViewer = document.getElementById("photoViewer");
    const viewerImage = document.getElementById("viewerImage");

    document.querySelectorAll(".memory-image").forEach(function (image) {
        image.addEventListener("click", function () {
            if (photoViewer && viewerImage) {
                photoViewer.classList.add("active");
                viewerImage.src = image.src;
            }
        });
    });

    const closeViewer = document.getElementById("closeViewer");

    if (closeViewer) {
        closeViewer.addEventListener("click", function () {
            photoViewer.classList.remove("active");
        });
    }

    if (photoViewer) {
        photoViewer.addEventListener("click", function (event) {
            if (event.target === photoViewer) {
                photoViewer.classList.remove("active");
            }
        });
    }


    // =========================
    // PRAYER FLIP CARDS
    // =========================

    document.querySelectorAll(".prayer-card").forEach(function (card) {
        card.addEventListener("click", function () {
            card.classList.toggle("flipped");
        });
    });


    // =========================
    // ITINERARY DETAILS
    // =========================

    document.querySelectorAll(".itinerary-detail").forEach(function (item) {
        item.addEventListener("click", function () {
            const description = item.nextElementSibling;

            if (description) {
                description.classList.toggle("show");
            }
        });
    });


    // =========================
    // LOVE LETTER ENVELOPE
    // =========================

    const envelope = document.getElementById("envelope");
    const letterOverlay = document.getElementById("letterOverlay");
    const closeLetter = document.getElementById("closeLetter");

    if (envelope && letterOverlay) {
        envelope.addEventListener("click", function () {
            envelope.classList.add("open");

            setTimeout(function () {
                letterOverlay.classList.add("show");
            }, 400);
        });
    }

    if (closeLetter && letterOverlay) {
        closeLetter.addEventListener("click", function () {
            letterOverlay.classList.remove("show");
        });
    }

    if (letterOverlay) {
        letterOverlay.addEventListener("click", function (event) {
            if (event.target === letterOverlay) {
                letterOverlay.classList.remove("show");
            }
        });
    }


    // =========================
    // GIFT SURPRISE
    // =========================

    const giftBox = document.getElementById("giftBox");
    const surpriseNote = document.getElementById("surpriseNote");

    if (giftBox && surpriseNote) {
        giftBox.addEventListener("click", function () {
            giftBox.classList.add("open");

            setTimeout(function () {
                surpriseNote.classList.add("show");
                surpriseNote.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

                createHearts();
            }, 600);
        });
    }


    // =========================
    // COUNTDOWN BIRTHDAY
    // =========================

    const countdown = document.getElementById("countdown");

    if (countdown) {
        const birthdayDate = new Date("2026-11-19T00:00:00+07:00");

        function updateCountdown() {
            const now = new Date();
            const difference = birthdayDate - now;

            if (difference <= 0) {
                countdown.innerHTML = "HAPPY BIRTHDAY, ALFAT! ♡";
                return;
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor(
                (difference / (1000 * 60 * 60)) % 24
            );
            const minutes = Math.floor(
                (difference / (1000 * 60)) % 60
            );
            const seconds = Math.floor(
                (difference / 1000) % 60
            );

            countdown.innerHTML = `
                <div class="countdown-item">
                    <span>${days}</span>
                    <small>DAYS</small>
                </div>

                <div class="countdown-item">
                    <span>${hours}</span>
                    <small>HOURS</small>
                </div>

                <div class="countdown-item">
                    <span>${minutes}</span>
                    <small>MINUTES</small>
                </div>

                <div class="countdown-item">
                    <span>${seconds}</span>
                    <small>SECONDS</small>
                </div>
            `;
        }

        updateCountdown();
        setInterval(updateCountdown, 1000);
    }


    // =========================
    // FLOATING HEARTS
    // =========================

    function createHearts() {
        for (let i = 0; i < 25; i++) {
            const heart = document.createElement("div");

            heart.classList.add("floating-heart");
            heart.innerHTML = "♡";

            heart.style.left = Math.random() * 100 + "vw";
            heart.style.animationDuration =
                (3 + Math.random() * 4) + "s";

            document.body.appendChild(heart);

            setTimeout(function () {
                heart.remove();
            }, 7000);
        }
    }


    // =========================
    // CLOSE LETTER WITH ESCAPE
    // =========================

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            if (letterOverlay) {
                letterOverlay.classList.remove("show");
            }

            if (photoViewer) {
                photoViewer.classList.remove("active");
            }
        }
    });

});