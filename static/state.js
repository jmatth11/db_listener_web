import { world } from "./world.js";

/**
 * The render state module.
 */
export const render_state = (function(){
  /**
   * Error types for state flow.
   */
  const error_types = {
    NO_CATEGORY: new Error("no category set"),
    NO_INDIVIDUAL: new Error("no individual set"),
    NO_KEY: new Error("no key set"),
  };
  /**
   * Render state type.
   */
  const type = {
    /* The default state (Grouped by table names) */
    PARENT: 1,
    /* The second state (Grouped by entries in a selected table) */
    CATEGORY: 1<<1,
    /* The third state (Details of an individual selected entry) */
    INDIVIDUAL: 1<<2,
    /* The fourth state (Grouping of connected entries) */
    CONNECTIONS: 1<<3,
  };
  /**
   * Internal render state.
   */
  const internal_state = {
    // TODO add items array here to keep track internally
    /* The canvas world coordinates and it's transformations */
    world_coords: new world(),
    /* The state */
    state_t: type.PARENT,
    /**
     * The path of selections.
     * 1st entry is "category" (table name).
     * 2nd entry is "individual" (entry's primary key).
     */
    path: [],
  };
  /**
   * Set the state to category with the given key.
   *
   * @param {string} key The category key.
   */
  function set_category(key) {
    if (internal_state.path.length > 0) {
      internal_state.path = [];
    }
    internal_state.path.push(key);
    internal_state.state_t = type.CATEGORY;
  }
  /**
   * Set the individual state with the given key.
   * If the category has not been set yet, this throws a
   * NO_CATEGORY error.
   *
   * @param {string} key The individual key.
   */
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
  /**
   * Set the connections state.
   * If the individual state is not already set this throws a
   * NO_CONNECTION error.
   */
  function set_connections() {
    if (internal_state.path.length != 2) {
      throw error_types.NO_INDIVIDUAL;
    }
    internal_state.state_t = type.CONNECTIONS;
  }
  /**
   * Set to the parent state.
   */
  function set_parent() {
    internal_state.path = [];
    internal_state.state_t = type.PARENT;
  }
  /**
   * Set the state to the previous state if there is one.
   */
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
  /**
   * Get the render state type.
   * @return {number} The render state type.
   */
  function get_type() {
    return internal_state.state_t;
  }
  /**
   * Get the current key. (for category and individual states)
   * If no key can be grabbed this function throws a NO_KEY error.
   *
   * @return {string} The current key.
   */
  function get_cur_key() {
    if (internal_state.path.length == 0) {
      throw error_types.NO_KEY;
    }
    return internal_state.path[internal_state.path.length - 1];
  }
  /**
   * Get the category key if there is one.
   * If no category key, this function throws a NO_KEY error.
   *
   * @return {string} The category key.
   */
  function get_category_key() {
    if (internal_state.path.length < 1) {
      throw error_types.NO_KEY;
    }
    return internal_state.path[0];
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
    get_category_key,
  }
})();
