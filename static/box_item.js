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

  draw_text_title(str, center_x, y) {
    const str_dim = this.txt.text_dimensions(str);
    const str_center_x = str_dim.width / 2;
    this.ctx.fillText(
      str,
      center_x - str_center_x,
      (y + str_dim.height)
    );
    return str_dim;
  }

  gen_box(value, rect, selected = false, title = undefined) {
    this.ctx.save();
    this.txt.set_font(this.#font);
    const rect_center_x = rect.x + (rect.width / 2);
    const rect_center_y = rect.y + (rect.height / 2);
    let new_width = rect.width;

    this.ctx.fillStyle = selected ? this.#selected_background_color : this.#background_color;
    this.ctx.beginPath();
    this.ctx.roundRect(rect.x, rect.y, rect.width, rect.height, 5);
    this.ctx.fill();

    this.ctx.fillStyle = this.#value_color;
    const value_dim = this.txt.text_dimensions(value);
    const value_center_x = value_dim.width / 2;
    const value_center_y = value_dim.height / 2;
    this.ctx.fillText(
      value,
      rect_center_x - value_center_x,
      rect_center_y + value_center_y,
    );

    let new_height = rect.height;
    if (title !== undefined) {
      this.ctx.fillStyle = this.#title_color;
      const title_dim = this.txt.text_dimensions(title);
      if (title_dim.width > rect.width) {
        const split_text = title.split(".");
        const st1_dim = this.draw_text_title(split_text[0], rect_center_x, rect.y + rect.height);
        const st2_dim = this.draw_text_title(
          split_text[1],
          rect_center_x,
          rect.y + rect.height + title_dim.height
        );
        new_height += (title_dim.height * 2);
        const tmp_width = st1_dim.width > st2_dim.width ? st1_dim.width : st2_dim.width;
        if (tmp_width > new_width) new_width = tmp_width;
      } else {
        this.draw_text_title(title, rect_center_x, rect.y + rect.height);
      }
    }
    this.ctx.restore();
    return {
      height: new_height,
      width: new_width,
    };
  }
}
