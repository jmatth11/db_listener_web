const render = (function(){
  const canvas = document.getElementById("main");
  const ctx = canvas.getContext("2d");
  const canvasLeft = canvas.offsetLeft + canvas.clientLeft;
  const canvasTop = canvas.offsetTop + canvas.clientTop;
  const detail_info = new details("main");
  const cons = new connections("main");
  const size = 40;
  const boxes = new box_item(ctx, size, size);
  const padding = 40;
  const state = render_state;
  let current_items = new Map();

  canvas.addEventListener("click", function(event) {
    const x = event.pageX - canvasLeft;
    const y = event.pageY - canvasTop;
    let clicked_item = false;
    switch (state.get_type()) {
      case state.type.PARENT: {
        for (const [key,item] of current_items.entries()) {
          if (y > item.rect.y && y < (item.rect.y + item.rect.height) &&
              x > item.rect.x && x < (item.rect.x + item.rect.width)) {
            clicked_item = true;
            state.set_category(key);
            render();
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
            clicked_item = true;
            render();
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
          clicked_item = true;
          render();
        }
        break;
      }
    }
    if (!clicked_item) {
      state.set_back();
      render();
    }
  }, false);

  function gen_rect(x, y) {
    return {
      x,
      y,
      width: size,
      height: size,
    };
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
      const gen_dim = boxes.gen_box(`${item.items.length}`, item.rect, false, title);
      if (gen_dim.height > size) max_height = gen_dim.height;
      point.x += (gen_dim.width + padding);
      if ((point.x + gen_dim.width) > canvas.width) {
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
  }

  return {
    add_items,
    render,
  };
})();
