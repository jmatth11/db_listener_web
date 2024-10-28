import { render_state } from "./state.js";
import { box_item } from "./box_item.js";
import { connections } from "./connections.js";
import { details } from "./details.js";
import { world, coordinates } from "./world.js";
import { WorldEvents } from "./event.js";

export const render = (function(){
  const canvas_id = "main";
  const canvas = document.getElementById(canvas_id);
  const ctx = canvas.getContext("2d");
  const canvasLeft = canvas.offsetLeft + canvas.clientLeft;
  const canvasTop = canvas.offsetTop + canvas.clientTop;
  const detail_info = new details(canvas_id);
  const cons = new connections(canvas_id);
  const size = 40;
  const boxes = new box_item(ctx, size, size);
  const padding = 40;
  const state = render_state;
  let current_items = new Map();
  const event_handler = new WorldEvents(canvas_id, state.get_world());

  canvas.addEventListener("click", function(event) {
    const x = event.pageX - canvasLeft;
    const y = event.pageY - canvasTop;
    switch (state.get_type()) {
      case state.type.PARENT: {
        for (const [key,item] of current_items.entries()) {
          if (y > item.rect.y && y < (item.rect.y + item.rect.height) &&
              x > item.rect.x && x < (item.rect.x + item.rect.width)) {
            state.set_category(key);
          }
        }
        break;
      }
      case state.type.CATEGORY: {
        const items = current_items.get(state.get_cur_key()).items;
        for (const item of items) {
          if (y > item.rect.y && y < (item.rect.y + item.rect.height) &&
              x > item.rect.x && x < (item.rect.x + item.rect.width)) {
            if (item.callback) {
              item.callback(item.ctx);
            }
            state.set_individual(item.ctx);
          }
        }
        break;
      }
      case state.type.INDIVIDUAL: {
        if (y > detail_info.button_rect.y &&
          y < (detail_info.button_rect.y + detail_info.button_rect.height) &&
            x > detail_info.button_rect.x &&
          x < (detail_info.button_rect.x + detail_info.button_rect.width)) {
          state.set_connections();
        }
        break;
      }
    }
  }, false);

  function gen_rect(x, y) {
    let new_coords = new coordinates();
    new_coords.x = x;
    new_coords.y = y;
    new_coords = state.get_world().transformed_pos(new_coords);
    return {
      x: new_coords.x,
      y: new_coords.y,
      width: size,
      height: size,
    };
  }

  function should_render(item_rect) {
    const rect_w = item_rect.x + item_rect.width;
    const rect_h = item_rect.y + item_rect.height;
    const within_sides = rect_w > canvasLeft && item_rect.x < (canvasLeft + canvas.width);
    return within_sides && rect_h > canvasTop && item_rect.y < (canvasTop + canvas.height);
  }

  // maybe have all items stacked by namespace and when clicked on
  // expand that section to then click on individual items.
  function add_items(items) {
    // not sure if I want to categorize the duplicates in a "version" property
    // or leave as-is and highlight them when selected.
    current_items = new Map();
    for (const item of items) {
      const channel = item.ctx.channel;
      if (!current_items.get(channel)) {
        current_items.set(channel, {
          rect: null,
          items: [],
        });
      }
      current_items.get(channel).items.push(item);
    }
  }

  function render_details(obj) {
    detail_info.display(obj.payload);
  }

  function render_items(items) {
    ctx.save();
    boxes.txt.set_font("12px serif");
    ctx.fillStyle = "#f00";
    boxes.txt.draw_text(state.get_category_key(), 5, 10);
    ctx.restore();
    const point = {x:5,y:15}
    for (const item of items) {
      const obj = item.ctx;
      const rect = gen_rect(point.x, point.y);
      item.rect = rect;
      point.x += (rect.width + padding);
      if ((point.x + rect.width) > canvas.width) {
        point.y += (rect.height + padding);
        point.x = 5;
      }
      if (!should_render(item.rect)) continue;
      // grab the primary key's value
      let selected = false;
      if (state.get_type() == state.type.INDIVIDUAL) {
        selected = obj.compare_primary_keys(state.get_cur_key());
      }
      const kvs = obj.get_primary_keys_name_and_values();
      const [_, title] = kvs[0];
      boxes.gen_box(title, rect, selected);
    }
  }

  function render_parents() {
    let point = {x: 5, y: 10};
    let max_height = size;
    for (const [title, item] of current_items.entries()) {
      const rect = gen_rect(point.x, point.y);
      item.rect = rect;
      let modified_rect = structuredClone(rect);
      if (should_render(item.rect)) {
        modified_rect = boxes.gen_box(`${item.items.length}`, item.rect, false, title);
      }
      if (modified_rect.height > size) max_height = modified_rect.height;
      point.x += (modified_rect.width + padding);
      if ((point.x + modified_rect.width) > canvas.width) {
        point.y += (max_height + padding);
        point.x = 5;
      }
    }
  }

  function render() {
    ctx.clearRect(0,0,canvas.width, canvas.height);
    switch (state.get_type()) {
      case state.type.PARENT: {
        render_parents();
        break;
      }
      case state.type.CATEGORY:
      case state.type.INDIVIDUAL:
        const items = current_items.get(state.get_category_key()).items;
        render_items(items);
        if (state.get_type() == state.type.INDIVIDUAL) {
          render_details(state.get_cur_key());
        }
        break;
      case state.type.CONNECTIONS: {
        const ind_cons = cons.aggregate_connections(state.get_cur_key(), current_items);
        cons.display_connections(state.get_cur_key(), ind_cons);
        break;
      }
    }
    // request animation frame to render a good FPS
    window.requestAnimationFrame(render);
  }

  function reset_state() {
    state.set_parent();
  }

  function previous_state() {
    state.set_back();
  }

  return {
    add_items,
    render,
    reset_state,
    previous_state,
  };
})();
