let socket;
(function() {
  const div = document.getElementById("main");

  const notifs = [];
  const items = [];
  const details = document.getElementById("details");
  function display_details(ctx) {
    const parent_div = document.createElement("div");
    for (const [key, value] of Object.entries(ctx.payload)) {
      const child_div = document.createElement("div");
      const label = document.createElement("label");
      const label_value = document.createElement("label");
      label.innerText = `${key}: `;
      label_value.innerText = `${value}`;
      child_div.appendChild(label);
      child_div.appendChild(label_value);
      parent_div.appendChild(child_div);
    }
    details.replaceChildren(parent_div);
  }
  socket = new WebSocket(`ws://${window.location.host}/ws`);
  socket.onopen = () => {
    console.log("connected");
  };
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.payload !== "") {
      console.warn(data);
      const tmp = {
        channel: data.channel,
        payload: JSON.parse(data.payload),
        metadata: data.metadata,
      };
      console.log(tmp);
      notifs.push(tmp);
      console.warn(tmp);
      const obj_keys = Object.keys(tmp.payload);
      items.push(render.gen_item(tmp.payload[obj_keys[0]],
          tmp,
          (ctx) => display_details(ctx),
      ));
      render.add_items(items, []);
    }
    console.log("server data", event.data);
  };
  socket.onerror = (err) => { console.error(err); };
  socket.onclose = () => { alert("connection closed"); };
  setInterval(render.render, 1000 * 60);
})()
