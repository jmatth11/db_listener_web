let socket;
const main = (function() {
  const notifs = [];
  const items = [];
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
  function clear_data() {
    notifs = [];
    items = [];
  }
  return {
    clear_data,
  };
})()
