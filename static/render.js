const render = (function(){
  const canvas = document.getElementById("main");
  const ctx = canvas.getContext("2d");
  const canvasLeft = canvas.offsetLeft + canvas.clientLeft;
  const canvasTop = canvas.offsetTop + canvas.clientTop;
  const size = 40;
  const padding = 40;
  let current_items = new Map();

  canvas.addEventListener("click", function(event) {
    const x = event.pageX - canvasLeft;
    const y = event.pageY - canvasTop;
    for (const item of current_items) {
      if (y > item.rect.y && y < (item.rect.y + item.rect.height) &&
          x > item.rect.x && x < (item.rect.x + item.rect.width)) {
        item.item.cb(item.item.ctx);
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

  function gen_item(text, ctx, cb) {
    return {
      text,
      ctx,
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
    current_items = new Map();
    let point = {x: 5, y: 100};
    for (const item of items) {
      if (!current_items.get(item.channel)) {
        current_items.set(item.channel, {
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
      current_items.get(item.channel).rect = rect;
      current_items.get(item.channel).items.push(item);
    }
  }

  function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1) + Math.pow(y2 - y1));
  }

  function render_items(rect, items) {
    const center_x = rect.x + (rect.width/2);
    const center_y = rect.y + (rect.height/2);
    for (const item of items) {

    }
  }

  function render() {
    for (const [title, item] of Object.entries(current_items)) {
      ctx.fillStyle = "#999";
      ctx.fillRect(item.rect.x, item.rect.y, item.rect.width, item.rect.height);
      ctx.fillStyle = "#fff";
      ctx.fillText(title, item.rect.x + 1, (item.rect.y + (item.rect.height/2)));
      render_items(item.rect, item.items);
    }
  }

  return {
    gen_item,
    link_item,
    add_items,
    render,
  };
})();
