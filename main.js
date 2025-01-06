import { socket } from './src/socket.js';
import { DrawingManager } from './src/drawing.js';

const canvas = document.getElementById('whiteboard');
const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');
const clearBtn = document.getElementById('clearBtn');


function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - document.querySelector('.toolbar').offsetHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);


const drawingManager = new DrawingManager(canvas, socket);


canvas.addEventListener('mousedown', (e) => {
    drawingManager.isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    [drawingManager.lastX, drawingManager.lastY] = [
        e.clientX - rect.left,
        e.clientY - rect.top
    ];
});

canvas.addEventListener('mousemove', (e) => drawingManager.handleDrawing(e));
canvas.addEventListener('mouseup', () => drawingManager.isDrawing = false);
canvas.addEventListener('mouseout', () => drawingManager.isDrawing = false);

colorPicker.addEventListener('change', (e) => drawingManager.setColor(e.target.value));
brushSize.addEventListener('change', (e) => drawingManager.setSize(e.target.value));

clearBtn.addEventListener('click', () => {
    drawingManager.clear();
    socket.emit('draw', { clear: true });
});


drawingManager.setColor(colorPicker.value);
drawingManager.setSize(brushSize.value);


socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('draw', (data) => {
    if (data.clear) {
        drawingManager.clear();
        return;
    }

    drawingManager.draw(
        data.x0,
        data.y0,
        data.x1,
        data.y1,
        data.color,
        data.size
    );
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

socket.on('connect_error', (error) => {
    console.error('Connection error:', error);
});
