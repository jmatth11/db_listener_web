export class WorldEvents {

  dragging = undefined;
  canvas_el = undefined;
  world = undefined;
  point = undefined;

  constructor(canvas_id, world) {
    this.dragging = false;
    this.canvas_el = document.getElementById(canvas_id);
    this.world = world;
    this.setup_listeners();
  }

  setup_listeners() {
    this.canvas_el.addEventListener("mousedown", (event) => {
      const info = this.#relative_pos(event);
      this.point = {
        x: info.x,
        y: info.y,
      };
      this.dragging = true;
    });

    this.canvas_el.addEventListener("mousemove", (event) => {
      if (this.dragging) {
        const info = this.#relative_pos(event);
        this.world.shift_by_coordinates(this.#pos_diff(info));
        this.point.x = info.x;
        this.point.y = info.y;
      }
    });

    this.canvas_el.addEventListener("mouseup", (event) => {
      this.dragging = false;
      const info = this.#relative_pos(event);
      this.point = undefined;
    });
  }

  #relative_pos(e) {
    var canvas = e.target,
    bx = canvas.getBoundingClientRect();
    return {
        x: (e.changedTouches ? e.changedTouches[0].clientX : e.clientX) - bx.left,
        y: (e.changedTouches ? e.changedTouches[0].clientY : e.clientY) - bx.top,
        bx: bx
    };
  }

  #pos_diff(p) {
    return {
      x: p.x - this.point.x,
      y: p.y - this.point.y,
    };
  }
}
