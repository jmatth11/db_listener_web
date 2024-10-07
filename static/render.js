let two = new Two({
  fullscreen: true,
  autostart: true
}).appendTo(document.body);

let physics = new Physics();
let current_items = new Map();
let radius = 20;
let padding = 40;

function gen_circle(x, y, mass=1) {
  let result = physics.makeParticle(mass, x, y);
  result.shape = two.makeCircle(x, y, radius);
  result.shape.noStroke().fill = 'rgb(255, 100, 100)';
  result.position = result.shape.translation;
  return result;
}

function gen_item(text, data, cb) {
  return {
    text,
    data,
    cb,
  };
}

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
      const rect = gen_circle(point.x, point.y);
      point.x += (rect.width + padding);
      if ((point.x + rect.width) > canvas.width) {
        point.y += (rect.height + padding);
        point.x = 5;
      }
      current_items.get(item.channel).rect = rect;
      current_items.get(item.channel).items.push(item);
    }
}

function make_connection(a, b) {
  let connection = new Two.Polygon([a.position, b.position]);
  two.add(connection);
  connection.linewidth = 10;
  connection.cap = 'round';
  connection.stroke = '#333';
  let strength = 0.02;
  let drag = 0.7;
  let rest = radius * 2;
  return physics.makeSpring(a, b, strength, drag, rest);
}

let x1 = two.width * 0.25;
let x2 = two.width * 0.75;
let y = two.height / 2;

let a = gen_circle(x1, y, 100);
let b = gen_circle(x2, y);

make_connection(a, b);

physics.onUpdate(function() {
  two.update();
});

physics.play();
