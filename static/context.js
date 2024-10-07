/**
 * Context class to manage a notification from the database.
 */
class context {
  #PRIMARY_KEY = "PRIMARY_KEY";
  #FOREIGN_KEY = "FOREIGN_KEY";
  /**
   * Construct a context object from a database notification.
   *
   * @param {string} channel The main key to differentiate the payloads.
   *  Typically the table schema and table name.
   * @param {Object} payload The data inserted or updated into the database.
   * @param {Object} metadata The metadata of the table, primary keys and foreign keys.
   */
  constructor(channel, payload, metadata) {
    this.channel = channel;
    this.payload = payload;
    this.metadata = metadata;
  }

  #get_metadata_by_type(t) {
    const len = this.metadata.metadatas.length;
    let result = [];
    for (let i = 0; i < len; ++i) {
      const md = this.metadata.metadatas[i];
      if (md.type == t) {
        result = md.columns;
        break;
      }
    }
    return result;
  }

  get_primary_keys() {
    return this.#get_metadata_by_type(this.#PRIMARY_KEY);
  }
  get_foreign_keys() {
    return this.#get_metadata_by_type(this.#FOREIGN_KEY);
  }

  get_primary_key_names() {
    const cols = this.#get_metadata_by_type(this.#PRIMARY_KEY);
    return cols.map((c) => c.column_name);
  }
  get_foreign_key_names() {
    const cols = this.#get_metadata_by_type(this.#FOREIGN_KEY);
    return cols.map((c) => c.column_name);
  }

  get_primary_keys_name_and_values() {
    const cols = this.#get_metadata_by_type(this.#PRIMARY_KEY);
    return cols.map((c) => (
      [
        c.column_name,
        this.payload[c.column_name],
      ]
    ));
  }
  get_foreign_keys_name_and_values() {
    const cols = this.#get_metadata_by_type(this.#FOREIGN_KEY);
    return cols.map((c) => (
      [
        c.column_name,
        this.payload[c.column_name],
      ]
    ));
  }
  get_foreign_keys_connections() {
    const cols = this.#get_metadata_by_type(this.#FOREIGN_KEY);
    return cols.map((c) => (
      {
        column: c.column_name,
        value: this.payload[c.column_name],
        connection_table: c.connection_table.table_name,
        connection_column: c.connection_table.column_name,
      }
    ));
  }
  compare_primary_keys(obj) {
    const kvs = this.get_primary_keys_name_and_values();
    for (const [c_name, c_val] of kvs) {
      if (obj.payload[c_name] !== c_val) {
        return false;
      }
    }
    return true;
  }
}

/**
 * Render item class to hold a Context object and a callback for events.
 */
class render_item {
  /**
   * Construct a render item.
   *
   * @param {context} ctx_p The context object.
   * @param {(ctx:context)=>void} callback Callback when context is clicked on.
   */
  constructor(ctx_p, callback) {
    this.ctx = ctx_p;
    this.callback = callback;
  }
}
