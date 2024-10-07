class box_item {
  #background_color = "#111";
  #selected_background_color = "#999";
  #value_color = "#0f0";
  #title_color = "#f00";
  #font = "12px serif";

  constructor(canvas_ctx, w, h) {
    this.w = w;
    this.h = h;
    this.ctx = canvas_ctx;
    this.txt = new text(this.ctx);
  }

  gen_box(value, rect, selected = false, title = undefined) {
    this.ctx.save();
    this.txt.set_font(this.#font);

    this.ctx.fillStyle = selected ? this.#selected_background_color : this.#background_color;
    this.ctx.beginPath();
    this.ctx.roundRect(rect.x, rect.y, rect.width, rect.height, 5);
    this.ctx.fill();

    this.ctx.fillStyle = this.#value_color;
    this.ctx.fillText(`${value}`, rect.x + (rect.width/2), (rect.y + (rect.height/2)));

    if (title !== undefined) {
      this.ctx.fillStyle = this.#title_color;
      this.ctx.fillText(title, rect.x, (rect.y + rect.height + 5));
    }
    this.ctx.restore();
  }
}
