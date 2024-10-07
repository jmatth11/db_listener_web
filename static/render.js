const render = (function(){
  const canvas = document.getElementById("main");
  const ctx = canvas.getContext("2d");
  const canvasLeft = canvas.offsetLeft + canvas.clientLeft;
  const canvasTop = canvas.offsetTop + canvas.clientTop;
  const size = 40;
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
            state.set_individual(key);
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
      const kvs = obj.get_primary_keys_name_and_values();
      const [_, title] = kvs[0];
      ctx.fillStyle = title == state.get_cur_key() ? "#999" : "#111";
      ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
      ctx.fillStyle = "#fff";
      ctx.fillText(title, rect.x + 1, (rect.y + (rect.height/2)));
    }
  }

  function render_parents() {
    for (const [title, item] of current_items.entries()) {
      ctx.fillStyle = "#111";
      ctx.fillRect(item.rect.x, item.rect.y, item.rect.width, item.rect.height);
      ctx.fillStyle = "#0f0";
      ctx.fillText(`${item.items.length}`, item.rect.x + (item.rect.width/2), (item.rect.y + (item.rect.height/2)));
      ctx.fillStyle = "#f00";
      ctx.fillText(title, item.rect.x, (item.rect.y + item.rect.height + 5));
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
        break;
      }
    }
  }

  return {
    add_items,
    render,
  };
})();
