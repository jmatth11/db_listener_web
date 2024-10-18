import { box_item } from "./box_item.js";
import { text } from "./text.js";

export class connections {
  constructor(canvas_id) {
    this.canvas = document.getElementById(canvas_id);
    this.ctx = this.canvas.getContext("2d");
    this.canvasLeft = this.canvas.offsetLeft + this.canvas.clientLeft;
    this.canvasTop = this.canvas.offsetTop + this.canvas.clientTop;
    this.txt = new text(this.ctx);
    this.box = new box_item(this.ctx);
  }

  aggregate_connections(item, mapping) {
    const cons = item.get_foreign_keys_connections();
    const results = [];
    for (const c of cons) {
      const foreign_table = mapping.get(c.connection_table);
      if (!foreign_table) continue;
      for (const entry of foreign_table.items) {
        if (entry.ctx.payload[c.connection_column] === c.value) {
          results.push(entry.ctx);
        }
      }
    }
    return results;
  }

  display_connections(item, cons) {
    const size = 50;
    this.ctx.save();
    console.warn(cons);
    const rect = {
      x: 10,
      y: (this.canvas.height / 2) - (size / 2),
      width: size,
      height: size,
    };
    const kvs = item.get_primary_keys_name_and_values();
    const [_, value] = kvs[0];
    this.box.gen_box(value, rect, false, item.channel);
    const child_rect = structuredClone(rect);
    child_rect.x = (this.canvas.width / 2) - (size / 2);
    child_rect.y = 10;
    const groupings = new Map();
    const padding = 10;
    for (const entry of cons) {
      const entry_kvs = entry.get_primary_keys_name_and_values();
      const [_, local_val] = entry_kvs[0];
      const key = `${entry.channel}:${local_val}`;
      if (!groupings.has(key)) {
        groupings.set(key, []);
      }
      groupings.get(key).push(entry);
    }
    // TODO save off rects so we can listen for click events
    for (const [k, v] of groupings.entries()) {
      const dims = this.txt.text_dimensions(k);
      child_rect.width = dims.width + padding;
      this.box.gen_box(k, child_rect);
      this.ctx.strokeStyle = "#000";
      this.ctx.beginPath();
      this.ctx.moveTo(rect.x + rect.width, rect.y + (rect.height / 2));
      this.ctx.lineTo(child_rect.x, child_rect.y + (child_rect.height / 2));
      this.ctx.stroke();
      child_rect.y += size + padding;
    }
    this.ctx.restore();
  }

}
