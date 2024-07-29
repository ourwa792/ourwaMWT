// public/board.js

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const ws = new WebSocket("ws://localhost:5000");

function resizeCanvas() {
    canvas.width = window.innerWidth * 0.7;
    canvas.height = window.innerHeight * 0.7;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let paint = false;
const localSettings = {
    lineWidth: 3,
    strokeStyle: 'black'
};

function startDraw(event) {
    paint = true;
    draw(event);
}

function endDraw(event) {
    if (!paint) return;
    paint = false;
    sendDrawData(event, false);
    ctx.beginPath();
}

function draw(event) {
    if (!paint) return;
    ctx.lineCap = 'round';
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(event.offsetX, event.offsetY);

    sendDrawData(event, true);
}

function sendDrawData(event, painting) {
    const drawData = {
        x: event.offsetX,
        y: event.offsetY,
        painting: painting,
        lineWidth: localSettings.lineWidth,
        strokeStyle: localSettings.strokeStyle
    };
    ws.send(JSON.stringify(drawData));
}

// تأكد من أن الحدث يتم تمريره كمعامل
function changeWidth(event) {
    localSettings.lineWidth = event.target.value;
    ctx.lineWidth = localSettings.lineWidth;
}

// تأكد من أن تغيير اللون يتم بشكل صحيح
function changeColor(event) {
    localSettings.strokeStyle = event.target.getAttribute('data-color');
    ctx.strokeStyle = localSettings.strokeStyle;
}

ws.onmessage = function(event) {
    const data = JSON.parse(event.data);
    ctx.save();
    ctx.lineWidth = data.lineWidth;
    ctx.strokeStyle = data.strokeStyle;
    if (data.painting) {
        ctx.lineCap = 'round';
        ctx.lineTo(data.x, data.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(data.x, data.y);
    } else {
        ctx.beginPath();
    }
    ctx.restore();
};

canvas.addEventListener('mousedown', startDraw);
canvas.addEventListener('mouseup', endDraw);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseleave', endDraw);

// تأكد من أن المستمع للأحداث يتم تعيينه بشكل صحيح
document.getElementById('slider').addEventListener('input', changeWidth);
document.getElementById('red').addEventListener('click', changeColor);
document.getElementById('green').addEventListener('click', changeColor);
document.getElementById('blue').addEventListener('click', changeColor);
document.getElementById('eraser').addEventListener('click', changeColor);
