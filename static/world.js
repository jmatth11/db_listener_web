export class coordinates {
  x;
  y;

  constructor() {
    this.x = 0;
    this.y = 0;
  }
}

export class world {
  origin;
  transform;

  constructor() {
    this.origin = new coordinates();
    this.transform = new coordinates();
  }

  shift_by_x(x) {
    this.transform.x += x;
  }
  shift_by_y(x) {
    this.transform.x += x;
  }
  shift_by_coordinates(coord) {
    this.transform.x += coord.x;
    this.transform.y += coord.y;
  }
  transformed_pos(coord) {
    let result = new coordinates();
    result.x = coord.x + this.transform.x;
    result.y = coord.y + this.transform.y;
    return result;
  }
  reset_to_origin() {
    this.transform = this.origin;
  }
}
