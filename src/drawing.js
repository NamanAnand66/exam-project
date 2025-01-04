export class DrawingManager {
  constructor(canvas, socket) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.socket = socket;
    this.isDrawing = false;
    this.lastX = 0;
    this.lastY = 0;
  }

  draw(x0, y0, x1, y1, color, size) {
    this.ctx.beginPath();
    this.ctx.moveTo(x0, y0);
    this.ctx.lineTo(x1, y1);
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = size;
    this.ctx.lineCap = 'round';
    this.ctx.stroke();
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  handleDrawing(e) {
    if (!this.isDrawing) return;
    
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    this.draw(this.lastX, this.lastY, x, y, this.currentColor, this.currentSize);

    // Emit the drawing data
    this.socket.emit('draw', {
      x0: this.lastX,
      y0: this.lastY,
      x1: x,
      y1: y,
      color: this.currentColor,
      size: this.currentSize
    });

    [this.lastX, this.lastY] = [x, y];
  }

  setColor(color) {
    this.currentColor = color;
  }

  setSize(size) {
    this.currentSize = size;
  }
}
