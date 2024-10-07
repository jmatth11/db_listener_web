let socket;
(function() {
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
      const tmp = new context(
        data.channel,
        JSON.parse(data.payload),
        data.metadata,
      );
      notifs.push(tmp);
      console.warn(tmp);
      items.push(new render_item(
          tmp,
          (ctx) => display_details(ctx),
      ));
      render.add_items(items);
      render.render();
    }
  };
  socket.onerror = (err) => { console.error(err); };
  socket.onclose = () => { alert("connection closed"); };
})()
