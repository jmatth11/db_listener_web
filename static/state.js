const render_state = (function(){
  const error_types = {
    NO_CATEGORY: new Error("no category set"),
    NO_INDIVIDUAL: new Error("no individual set"),
  };
  const type = {
    PARENT: 1,
    CATEGORY: 1<<1,
    INDIVIDUAL: 1<<2,
    CONNECTIONS: 1<<3,
  };
  const internal_state = {
    state_t: type.PARENT,
    path: [],
  };
  function set_category(key) {
    if (internal_state.path.length > 0) {
      internal_state.path = [];
    }
    internal_state.path.push(key);
    internal_state.state_t = type.CATEGORY;
  }
  function set_individual(key) {
    const len = internal_state.path.length;
    if (len > 1) {
      internal_state.path.pop();
    } else if (len == 0) {
      throw error_types.NO_CATEGORY;
    }
    internal_state.path.push(key);
    internal_state.state_t = type.INDIVIDUAL;
  }
  function set_connections() {
    if (internal_state.path.length != 2) {
      throw error_types.NO_INDIVIDUAL;
    }
    internal_state.state_t = type.CONNECTIONS;
  }
  function set_parent() {
    internal_state.path = [];
    internal_state.state_t = type.PARENT;
  }
  function set_back() {
    if (internal_state.state_t == type.CONNECTIONS) {
      internal_state.state_t = type.INDIVIDUAL;
      return;
    }
    let len = internal_state.path.length;
    if (len > 0) {
      internal_state.path.pop();
    }
    len = internal_state.path.length;
    if (len == 0) internal_state.state_t = type.PARENT;
    if (len == 1) internal_state.state_t = type.CATEGORY;
  }
  function get_type() {
    return internal_state.state_t;
  }
  function get_cur_key() {
    return internal_state.path[internal_state.path.length - 1];
  }
  function get_category_key() {
    if (internal_state.path.length < 2) {
      throw error_types.NO_CATEGORY;
    }
    return internal_state.path[1];
  }
  return {
    type,
    error_types,
    set_parent,
    set_category,
    set_individual,
    set_connections,
    set_back,
    get_type,
    get_cur_key,
  }
})();
