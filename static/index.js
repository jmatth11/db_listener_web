let socket;
(function() {
  const div = document.getElementById("main");

  socket = new WebSocket("ws://localhost:3000/ws");
  socket.onopen = () => {
    console.log("connected");
  };
  socket.onmessage = (event) => {
    console.log("server data", event.data);
  };
  socket.onerror = (err) => { console.error(err); };
  socket.onclose = () => { console.log("connection closed"); };
})()
