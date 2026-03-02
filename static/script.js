const coin = document.getElementById('coin');
const flipBtn = document.getElementById('flipBtn');
const statusText = document.getElementById('status');
const container = document.querySelector('.coin-container');

// Sound Effects (Optional - browsers may block auto-audio, but works on click)
// You can add a file named 'flip.mp3' to static folder if you want sound.
// const audio = new Audio('/static/flip.mp3'); 

let currentRotation = 0;

flipBtn.addEventListener('click', async () => {
    // 1. Disable button to prevent double clicks
    flipBtn.disabled = true;
    statusText.innerText = "CALCULATING TRAJECTORY...";
    container.classList.add('flipping');

    // Play sound if you added it
    // audio.play();

    try {
        // 2. Request Result from Python Backend
        const response = await fetch(`/flip?t=${Date.now()}`);
        const data = await response.json();
        const result = data.result; // 'heads' or 'tails'

        // 3. Calculate Rotation
        // We want it to spin at least 5 times (1800 degrees) + the result
        const minSpins = 5;
        const extraSpins = Math.floor(Math.random() * 3); // Random variation 0-2 extra spins
        const baseRotation = (minSpins + extraSpins) * 360;

        // If result is tails, we need to end on 180 (or 180 + 360n)
        // If heads, we end on 0 (or 360n)
        let targetRotation = 0;

        if (result === 'heads') {
            targetRotation = baseRotation;
        } else {
            targetRotation = baseRotation + 180;
        }

        // Add to current rotation so it always spins FORWARD, never snaps back
        // We ensure the math adds up to the next correct landing spot

        // Adjust for current state:
        // If currentRotation is 180 (tails) and we want heads (0/360), we add 180 to reach 360.
        // But we want BIG spins.

        currentRotation += targetRotation;

        // Apply CSS Transform
        coin.style.transform = `rotateY(${currentRotation}deg)`;

        // 4. Handle Result Display after animation (3 seconds matches CSS)
        setTimeout(() => {
            statusText.innerText = `RESULT: ${result.toUpperCase()}`;
            flipBtn.disabled = false;
            container.classList.remove('flipping');

            // Add a little glow pulse to indicate finish
            statusText.style.animation = "pulse 0.5s ease";
        }, 3000);

    } catch (error) {
        console.error("Flip failed:", error);
        statusText.innerText = "ERROR";
        flipBtn.disabled = false;
    }
});