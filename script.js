const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const spinButton = document.getElementById("spinButton");
const resultDiv = document.getElementById("result");

const wheelValues = [];
const minValue = 100000;
const maxValue = 10000000; // Updated max value to 10,000,000
const numSegments = 12;

// Generate random values for the wheel
for (let i = 0; i < numSegments; i++) {
    const value = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
    wheelValues.push(value);
}

const wheelColors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#FFC133', '#33FFF7', '#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF'];
let startAngle = 0;
let arc = Math.PI / (numSegments / 2);
let spinTimeout = null;

// Load the center image
const centerImage = new Image();
centerImage.src = 'center-image.png'; // The path to your image file
const imageSize = 100; // Set the desired size of the image

function drawWheel() {
    // Draw each segment of the wheel
    for (let i = 0; i < numSegments; i++) {
        const angle = startAngle + i * arc;
        ctx.fillStyle = wheelColors[i];
        ctx.beginPath();
        ctx.moveTo(250, 250);
        ctx.arc(250, 250, 250, angle, angle + arc, false);
        ctx.lineTo(250, 250);
        ctx.fill();

        ctx.save();
        ctx.fillStyle = "white";
        ctx.translate(250 + Math.cos(angle + arc / 2) * 200, 250 + Math.sin(angle + arc / 2) * 200);
        ctx.rotate(angle + arc / 2 + Math.PI / 2);
        ctx.fillText(`€${wheelValues[i].toLocaleString()}`, -ctx.measureText(`€${wheelValues[i].toLocaleString()}`).width / 2, 0);
        ctx.restore();
    }

    // Draw the center image
    ctx.drawImage(centerImage, (canvas.width - imageSize) / 2, (canvas.height - imageSize) / 2, imageSize, imageSize);

    // Draw the pointer
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.moveTo(245, 0);  // Start at the top center of the wheel
    ctx.lineTo(255, 0);
    ctx.lineTo(250, 40); // Draw downward to form a triangle
    ctx.fill();
}

function spin() {
    const spinAngle = Math.random() * 10 + 10;
    let spinAngleStart = spinAngle;
    let spinTime = 0;
    const spinTimeTotal = Math.random() * 3000 + 4000;

    function rotateWheel() {
        spinTime += 30;
        if (spinTime >= spinTimeTotal) {
            stopRotateWheel();
            return;
        }
        const spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
        startAngle += spinAngle * Math.PI / 180;
        drawWheel();
        spinTimeout = setTimeout(rotateWheel, 30);
    }

    function stopRotateWheel() {
        const degrees = startAngle * 180 / Math.PI + 90;
        const arcd = arc * 180 / Math.PI;
        const index = Math.floor((360 - degrees % 360) / arcd);
        resultDiv.innerText = `New COR valuation: €${wheelValues[index].toLocaleString()}`;
        spinButton.disabled = false;
    }

    function easeOut(t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b;
    }

    spinButton.disabled = true;
    rotateWheel();
}

spinButton.addEventListener("click", spin);

// Ensure the image is loaded before drawing the wheel
centerImage.onload = function() {
    drawWheel();
};
