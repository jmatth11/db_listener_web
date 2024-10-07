let socket;
(function() {
  const notifs = [];
  const items = [];
  socket = new WebSocket("ws://localhost:3000/ws");
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
      };
      console.log(tmp);
      notifs.push(tmp);
      const obj_keys = Object.keys(tmp.payload);
      items.push(render.gen_item(tmp.payload[obj_keys[0]],
          tmp.payload,
          (ctx) => console.log("ctx", ctx),
      ));
      render.add_items(items, []);
      render.render();
    }
    console.log("server data", event.data);
  };
  socket.onerror = (err) => { console.error(err); };
  socket.onclose = () => { console.log("connection closed"); };
})()
