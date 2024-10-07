class details {
  #font = "16px serif";
  constructor(canvas_id) {
    this.canvas = document.getElementById(canvas_id);
    this.ctx = this.canvas.getContext("2d");
    this.canvasLeft = this.canvas.offsetLeft + this.canvas.clientLeft;
    this.canvasTop = this.canvas.offsetTop + this.canvas.clientTop;
    this.txt = new text(this.ctx);
    this.startX = 10;
    this.startY = 10;
  }

  #draw_background() {
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    this.ctx.beginPath();
    this.ctx.roundRect(this.startX, this.startY, this.canvas.width - this.startX, this.canvas.height - this.startY, 20);
    this.ctx.fill();
  }

  display(obj) {
    this.ctx.save();
    this.txt.set_font(this.#font);
    this.#draw_background();
    const point = {x:this.startX + 20, y:this.startY + 20};
    const padding = 10;
    // TODO need to account for runoff (for width and height of display area)
    this.ctx.fillStyle = "#fff";
    for (const [key, value] of Object.entries(obj)) {
      const display_text = `${key}: ${value}`;
      const dim = this.txt.text_dimensions(display_text);
      this.txt.draw_text(display_text, point.x, point.y);
      point.y += (dim.height + padding);
    }
    this.ctx.restore();
  }
}
