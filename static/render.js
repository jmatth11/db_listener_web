const render = (function(){
  const canvas = document.getElementById("main");
  const ctx = canvas.getContext("2d");
  const canvasLeft = canvas.offsetLeft + canvas.clientLeft;
  const canvasTop = canvas.offsetTop + canvas.clientTop;
  const detail_info = new details("main");
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
            item.callback(item.ctx);
            const kvs = item.ctx.get_primary_keys_name_and_values();
            const [_, key] = kvs[0];
            state.set_individual(item.ctx);
            clicked_item = true;
            render();
          }
        }
        break;
      }
      case state.type.INDIVIDUAL: {

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
    let point = {x: 5, y: 5};
    for (const item of items) {
      const channel = item.ctx.channel;
      if (!current_items.get(channel)) {
        const rect = gen_rect(point.x, point.y);
        point.x += (rect.width + padding);
        if ((point.x + rect.width) > canvas.width) {
          point.y += (rect.height + padding);
          point.x = 5;
        }
        current_items.set(channel, {
          rect: rect,
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
    let point = {x: 5, y: 5};
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
    for (const [title, item] of current_items.entries()) {
      boxes.gen_box(`${item.items.length}`, item.rect, false, title);
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
      case state.type.INDIVIDUAL: {
        const items = current_items.get(state.get_category_key()).items;
        render_items(items);
        if (state.get_type() == state.type.INDIVIDUAL) {
          render_details(state.get_cur_key());
        }
        break;
      }
    }
  }

  return {
    add_items,
    render,
  };
})();
