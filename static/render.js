const render = (function(){
  const canvas = document.getElementById("main");
  const ctx = canvas.getContext("2d");
  const canvasLeft = canvas.offsetLeft + canvas.clientLeft;
  const canvasTop = canvas.offsetTop + canvas.clientTop;
  const size = 40;
  const padding = 40;
  // TODO clean up
  const state = {
    showParents: true,
    showCategory: false,
    categoryName: "",
    showIndividual: false,
    individualName: "",
  };
  let current_items = new Map();

  canvas.addEventListener("click", function(event) {
    const x = event.pageX - canvasLeft;
    const y = event.pageY - canvasTop;
    if (state.showParents) {
      for (const [key,item] of current_items.entries()) {
        if (y > item.rect.y && y < (item.rect.y + item.rect.height) &&
            x > item.rect.x && x < (item.rect.x + item.rect.width)) {
          state.showParents = false;
          state.showCategory = true;
          state.categoryName = key;
          render();
        }
      }
    } else if (state.showCategory) {
      const items = current_items.get(state.categoryName).items;
      let clicked_item = false;
      for (const item of items) {
        if (y > item.rect.y && y < (item.rect.y + item.rect.height) &&
            x > item.rect.x && x < (item.rect.x + item.rect.width)) {
          // TODO change to be better
          item.cb(item.ctx);
          state.individualName = item.ctx.payload[item.ctx.metadata.metadatas[0].columns[0].column_name];
          clicked_item = true;
          render();
        }
      }
      if (!clicked_item) {
        state.showParents = true;
        state.categoryName = "";
        state.showCategory = false;
        state.individualName = "";
        render();
      }
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

  function gen_item(ctx_p, cb) {
    return {
      ctx: ctx_p,
      cb,
    };
  }

  function link_item(idx1, idx2) {
    return {
      idx1,
      idx2,
    };
  }

  // maybe have all items stacked by namespace and when clicked on
  // expand that section to then click on individual items.
  function add_items(items) {
    // I think we need to dedupe some of the entries
    // or maybe I should manage the list in here rather than the index.js page
    current_items = new Map();
    let point = {x: 5, y: 5};
    for (const item of items) {
      const channel = item.ctx.channel;
      if (!current_items.get(channel)) {
        console.log(`creating new entry for ${channel}`);
        current_items.set(channel, {
          rect: undefined,
          items: [],
        });
      }
      const rect = gen_rect(point.x, point.y);
      point.x += (rect.width + padding);
      if ((point.x + rect.width) > canvas.width) {
        point.y += (rect.height + padding);
        point.x = 5;
      }
      current_items.get(channel).rect = rect;
      current_items.get(channel).items.push(item);
    }
  }

  function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1) + Math.pow(y2 - y1));
  }

  //function render_items(rect, items) {
  //  const center_x = rect.x + (rect.width/2);
  //  const center_y = rect.y + (rect.height/2);
  //  for (const item of items) {

  //  }
  //}

  function render_items(items) {
    console.log("render items");
    let point = {x: 5, y: 5};
    for (const item of items) {
      const obj = item.ctx;
      const metadata = obj.metadata.metadatas;
      const rect = gen_rect(point.x, point.y);
      item.rect = rect;
      point.x += (rect.width + padding);
      if ((point.x + rect.width) > canvas.width) {
        point.y += (rect.height + padding);
        point.x = 5;
      }
      // grab the primary key's value
      const title = obj.payload[metadata[0].columns[0].column_name];
      ctx.fillStyle = title == state.individualName ? "#999" : "#111";
      ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
      ctx.fillStyle = "#fff";
      ctx.fillText(title, rect.x + 1, (rect.y + (rect.height/2)));
    }
  }

  function render_parents() {
    console.log("render parents");
    for (const [title, item] of current_items.entries()) {
      console.log("title", title);
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
    console.log("render function");
    if (state.showParents) {
      render_parents();
    } else if (state.showCategory) {
      const items = current_items.get(state.categoryName).items;
      render_items(items);
    }
  }

  return {
    gen_item,
    link_item,
    add_items,
    render,
  };
})();
