// Get elements
const yesButton = document.getElementById('yesButton');
const noButton = document.getElementById('noButton');
const heading = document.getElementById('heading');
const mainGif = document.getElementById('mainGif');
const buttonsContainer = document.getElementById('buttonsContainer');
const confettiCanvas = document.getElementById('confetti');

// GIF URLs
const pleadingGif = 'couple-photo.jpeg'; // Your photo together
const celebrationGif = 'https://media.giphy.com/media/artj92V8o75VPL7AeQ/giphy.gif'; // Celebration

// Track hover attempts
let hoverCount = 0;

// Function to get random position for NO button
function getRandomPosition() {
    const container = buttonsContainer.getBoundingClientRect();
    const button = noButton.getBoundingClientRect();
    
    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Calculate safe boundaries (with padding)
    const padding = 20;
    const maxX = viewportWidth - button.width - padding;
    const maxY = viewportHeight - button.height - padding;
    
    // Generate random position
    let randomX = Math.random() * maxX;
    let randomY = Math.random() * maxY;
    
    // Ensure it's not too close to YES button
    const yesButtonRect = yesButton.getBoundingClientRect();
    const minDistance = 150; // Minimum distance from YES button
    
    // Calculate distance from YES button
    const distance = Math.sqrt(
        Math.pow(randomX - yesButtonRect.left, 2) + 
        Math.pow(randomY - yesButtonRect.top, 2)
    );
    
    // If too close, try again (simple approach)
    if (distance < minDistance) {
        randomX = Math.random() * maxX;
        randomY = Math.random() * maxY;
    }
    
    return { x: randomX, y: randomY };
}

// Function to move NO button
function moveNoButton() {
    hoverCount++;
    
    const position = getRandomPosition();
    
    // Add hiding effect on later attempts
    if (hoverCount > 2) {
        noButton.classList.add('hiding');
        
        setTimeout(() => {
            noButton.style.position = 'fixed';
            noButton.style.left = position.x + 'px';
            noButton.style.top = position.y + 'px';
            noButton.classList.remove('hiding');
        }, 300);
    } else {
        noButton.style.position = 'fixed';
        noButton.style.left = position.x + 'px';
        noButton.style.top = position.y + 'px';
    }
}

// Desktop: mouseenter event
noButton.addEventListener('mouseenter', moveNoButton);

// Mobile: touchstart event with prevention
noButton.addEventListener('touchstart', (e) => {
    e.preventDefault();
    moveNoButton();
});

// Proximity detection for mobile (finger approaching)
let touchMoving = false;
document.addEventListener('touchmove', (e) => {
    if (touchMoving) return;
    
    const touch = e.touches[0];
    const buttonRect = noButton.getBoundingClientRect();
    
    // Calculate distance from touch to button
    const distance = Math.sqrt(
        Math.pow(touch.clientX - (buttonRect.left + buttonRect.width / 2), 2) +
        Math.pow(touch.clientY - (buttonRect.top + buttonRect.height / 2), 2)
    );
    
    // If finger is within 80px of button, move it
    if (distance < 80 && noButton.style.position === 'fixed') {
        touchMoving = true;
        moveNoButton();
        setTimeout(() => { touchMoving = false; }, 300);
    }
});

// YES button click handler
yesButton.addEventListener('click', () => {
    // Update heading
    heading.textContent = "Yay! I knew you'd say yes! 🎉💕";
    heading.style.color = '#FF1493';
    
    // Change GIF to celebration
    mainGif.src = celebrationGif;
    mainGif.alt = 'Celebration!';
    
    // Hide NO button
    noButton.style.display = 'none';
    
    // Make YES button static and centered
    yesButton.style.position = 'static';
    buttonsContainer.style.justifyContent = 'center';
    
    // Disable YES button
    yesButton.disabled = true;
    yesButton.style.cursor = 'default';
    yesButton.textContent = '🎉 YES! 🎉';
    
    // Add success class
    document.querySelector('.content').classList.add('success');
    
    // Add sweet personal message after a moment
    setTimeout(() => {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'love-message';
        messageDiv.innerHTML = `
            <p>Always you're my precious Thangooo... ❤️</p>
            <p>I love youuuu sooo much my Bondu 💕</p>
        `;
        document.querySelector('.content').appendChild(messageDiv);
    }, 2000);
    
    // Launch confetti
    launchConfetti();
    
    // Add some hearts floating up
    createFloatingHearts();
});

// Confetti animation
function launchConfetti() {
    const canvas = confettiCanvas;
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const confettiPieces = [];
    const confettiCount = 150;
    const colors = ['#FF1493', '#FF69B4', '#FFB6C1', '#FFC0CB', '#FF6B9D', '#FFD700', '#FFA500'];
    
    // Create confetti pieces
    for (let i = 0; i < confettiCount; i++) {
        confettiPieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            size: Math.random() * 10 + 5,
            speedY: Math.random() * 3 + 2,
            speedX: Math.random() * 2 - 1,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 10 - 5
        });
    }
    
    function drawConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        confettiPieces.forEach((piece, index) => {
            ctx.save();
            ctx.translate(piece.x, piece.y);
            ctx.rotate((piece.rotation * Math.PI) / 180);
            ctx.fillStyle = piece.color;
            ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
            ctx.restore();
            
            // Update position
            piece.y += piece.speedY;
            piece.x += piece.speedX;
            piece.rotation += piece.rotationSpeed;
            
            // Remove if off screen
            if (piece.y > canvas.height) {
                confettiPieces.splice(index, 1);
            }
        });
        
        if (confettiPieces.length > 0) {
            requestAnimationFrame(drawConfetti);
        }
    }
    
    drawConfetti();
}

// Create floating hearts animation
function createFloatingHearts() {
    const heartEmojis = ['💕', '💖', '💗', '💓', '💝', '❤️', '🌹'];
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
            heart.style.position = 'fixed';
            heart.style.left = Math.random() * window.innerWidth + 'px';
            heart.style.bottom = '-50px';
            heart.style.fontSize = (Math.random() * 30 + 20) + 'px';
            heart.style.zIndex = '9998';
            heart.style.pointerEvents = 'none';
            heart.style.transition = 'all 3s ease-out';
            
            document.body.appendChild(heart);
            
            setTimeout(() => {
                heart.style.bottom = window.innerHeight + 100 + 'px';
                heart.style.opacity = '0';
                heart.style.transform = 'rotate(' + (Math.random() * 360) + 'deg)';
            }, 100);
            
            setTimeout(() => {
                heart.remove();
            }, 3100);
        }, i * 150);
    }
}

// Handle window resize
window.addEventListener('resize', () => {
    if (noButton.style.position === 'fixed') {
        const position = getRandomPosition();
        noButton.style.left = position.x + 'px';
        noButton.style.top = position.y + 'px';
    }
});

// NO button click handler - playful responses if they manage to click it
let noClickCount = 0;
const playfulMessages = [
    "Oops! Wrong button! 😜",
    "Try again... the YES button is right there! 👉",
    "Come on, you know you want to say YES! 💕",
    "The NO button is broken, sorry! 😅",
    "Nope! Not accepting NO today! 🙅‍♂️",
    "Still waiting for that YES... ⏰",
    "Are you sure? Look at that photo! 🥺",
    "The YES button is feeling lonely... 💔",
    "Third time's the charm... click YES! ✨"
];

noButton.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Show playful message
    const message = playfulMessages[noClickCount % playfulMessages.length];
    
    // Temporarily change heading to show message
    const originalText = heading.textContent;
    heading.textContent = message;
    heading.style.color = '#FF6B9D';
    
    // Shake the NO button
    noButton.style.animation = 'shake 0.5s';
    
    // Make YES button pulse to draw attention
    yesButton.style.animation = 'pulse 0.5s ease-in-out 3';
    
    setTimeout(() => {
        heading.textContent = originalText;
        heading.style.color = '#FF1493';
        noButton.style.animation = '';
        yesButton.style.animation = '';
    }, 2000);
    
    noClickCount++;
    
    // After click, move the button again
    setTimeout(() => {
        moveNoButton();
    }, 2000);
});
