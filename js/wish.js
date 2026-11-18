
document.addEventListener("DOMContentLoaded", function () {

    const wishInput = document.getElementById("wishInput");
    const wishCounter = document.getElementById("wishCounter");
    const makeWishBtn = document.getElementById("makeWishBtn");
    const wishResult = document.getElementById("wishResult");
    const wishMessage = document.getElementById("wishMessage");

    // =====================================
    // CHARACTER COUNTER
    // =====================================

    wishInput.addEventListener("input", function () {
        wishCounter.textContent = `${wishInput.value.length} / 200`;
    });

    // =====================================
    // MAKE A WISH
    // =====================================

    makeWishBtn.addEventListener("click", function () {

        const wish = wishInput.value.trim();

        if (wish === "") {
            wishInput.focus();
            wishInput.placeholder = "Don't forget to make a wish...";
            return;
        }

        wishMessage.textContent = wish;

        wishResult.classList.remove("show");

        // Restart animation
        void wishResult.offsetWidth;

        wishResult.classList.add("show");

        createShootingStars();

        makeWishBtn.textContent = "Wish Made ✦";
        makeWishBtn.disabled = true;

        wishInput.disabled = true;

    });

    // =====================================
    // SHOOTING STAR ANIMATION
    // =====================================

    function createShootingStars() {

        const background = document.querySelector(".wish-background");

        for (let i = 0; i < 8; i++) {

            const star = document.createElement("div");

            star.classList.add("wish-shooting-star");

            star.style.top = Math.random() * 70 + "%";
            star.style.left = Math.random() * 80 + "%";

            star.style.animationDelay = Math.random() * 1.5 + "s";

            background.appendChild(star);

            setTimeout(function () {
                star.remove();
            }, 3000);

        }

    }

});
