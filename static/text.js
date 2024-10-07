/**
 * Simple text wrapper object.
 */
class text {
  constructor(canvas_ctx) {
    this.ctx = canvas_ctx;
  }

  /**
   * Set the font.
   * @param {string} Font string (i.e. "48px serif")
   */
  set_font(font_info) {
    this.ctx.font = font_info;
  }

  /**
   * Draw normal text at a given x and y coordinates.
   *
   * @param {string} str The text to draw.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  draw_text(str, x, y) {
    this.ctx.fillText(str, x, y);
  }

  /**
   * Get the text dimensions of the given text with the current font set.
   * @return {{height:number,width:number}} The text metrics.
   */
  text_dimensions(str) {
    const metrics = this.ctx.measureText(str);
    return {
      width: metrics.width,
      height: metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent,
    };
  }
}
