import { render } from "./render.js";
import { context, render_item } from "./context.js";

let socket;
(function() {
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
  document.getElementById("reset-button").onclick = clear_data;
  document.getElementById("back-button").onclick = render.previous_state;
  document.getElementById("reset-graph").onclick = render.reset_world_pos;
})();
