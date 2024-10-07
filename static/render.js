const render = (function(){
  const canvas = document.getElementById("main");
  const ctx = canvas.getContext("2d");
  const canvasLeft = canvas.offsetLeft + canvas.clientLeft;
  const canvasTop = canvas.offsetTop + canvas.clientTop;
  const size = 40;
  const padding = 10;
  let current_items = [];

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
  function add_items(items, links) {
    current_items = [];
    let point = {x: 5, y: 5};
    for (const item of items) {
      const rect = gen_rect(point.x, point.y);
      point.x += (rect.width + padding);
      if ((point.x + point.width) > canvas.width) {
        point.y += (rect.height + padding);
        point.x = 5;
      }
      current_items.push({
        rect,
        item,
      });
    }
  }

  function render() {
    for (const item of current_items) {
      ctx.fillStyle = "#000";
      ctx.fillRect(item.rect.x, item.rect.y, item.rect.width, item.rect.height);
      ctx.fillStyle = "#fff";
      ctx.fillText(item.item.text, item.rect.x + 1, (item.rect.y + (item.rect.width/2)));
    }
  }

  return {
    gen_item,
    link_item,
    add_items,
    render,
  };
})();
