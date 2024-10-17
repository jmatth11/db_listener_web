let socket;
const main = (function() {
  let items = [];
  const checkmark = "&#x2714;";
  const xmark = "&#x274c;"
  socket = new WebSocket(`ws://${window.location.host}/ws`);
  socket.onopen = () => {
    const statusEl = document.getElementById("status");
    statusEl.innerHTML = `connected: <label style="color:green;">${checkmark}</label>`;
  };
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.payload !== "") {
      const tmp = new context(
        data.channel,
        JSON.parse(data.payload),
        data.metadata,
      );
      items.push(new render_item(
          tmp,
          null
      ));
      render.add_items(items);
      render.render();
    }
  };
  socket.onerror = (err) => {
    console.error(err);
    const statusEl = document.getElementById("status");
    statusEl.innerHTML = `error with socket: <label style="color:red;">${xmark}</label>`;
  };
  socket.onclose = () => {
    const statusEl = document.getElementById("status");
    statusEl.innerHTML = `not connected: <label style="color:red;">${xmark}</label>`;
  };
  function clear_data() {
    items = [];
    render.add_items(items);
    render.reset_state();
  }
  return {
    clear_data,
  };
})()
