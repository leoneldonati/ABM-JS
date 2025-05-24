/**
 * A class for managing application state with optional persistence to localStorage
 * and a subscription-based system for notifying listeners of state changes.
 * @class
 */
class Store {
  /**
   * The private state object that holds the current state.
   * @private
   * @type {Object}
   */
  #state;

  /**
   * The private configuration object for the store.
   * @private
   * @type {{ persist: boolean, name: string, forceInitialState: boolean }}
   */
  #config = {
    persist: false,
    name: "",
    forceInitialState: false,
  };

  /**
   * A private set of listener callbacks that are notified when the state changes.
   * @private
   * @type {Set<Function>}
   */
  #listeners = new Set();

  /**
   * Creates a new Store instance with an initial state and configuration.
   * @param {Object} [initialState={}] - The initial state of the store.
   * @param {Object} config - Configuration object for the store.
   * @param {boolean} [config.persist=false] - Whether to persist the state to localStorage.
   * @param {string} [config.name=""] - The key used for localStorage when persist is true.
   * @param {boolean} [config.forceInitialState=false] - If true, forces the initial state to override existing localStorage data.
   * @throws {Error} If config is missing or invalid.
   * @throws {Error} If persist is true but name is not provided or is not a string.
   * @throws {Error} If persist is not a boolean.
   * @throws {Error} If initialState is not JSON-serializable.
   */
  constructor(initialState, config) {
    if (!config)
      throw new Error(
        "Falta el segundo parámetro de configuración, debe ser un objeto con persist y name."
      );

    if (config.persist && !config.name)
      throw new Error("Debes ingresar el nombre del store");

    if (typeof config.persist !== "boolean")
      throw new Error("persist debe ser un valor booleano.");
    if (typeof config.name !== "string")
      throw new Error("name debe ser de tipo string.");

    try {
      JSON.stringify(initialState ?? {});
    } catch (e) {
      throw new Error("El initialState debe ser un objeto serializable.");
    }

    this.#config = { ...this.#config, ...config };

    if (this.#config.persist) {
      const stored = localStorage.getItem(this.#config.name);
      if (stored && !this.#config.forceInitialState) {
        try {
          this.#state = JSON.parse(stored);
        } catch (e) {
          console.error("Error al parsear el estado desde localStorage:", e);
          this.#state = initialState ?? {};
        }
      } else {
        this.#state = initialState ?? {};
        localStorage.setItem(this.#config.name, JSON.stringify(this.#state));
      }
      return;
    }

    this.#state = initialState ?? {};
  }

  /**
   * Retrieves the current state of the store.
   * If persistence is enabled, attempts to load the state from localStorage.
   * The returned state is immutable (frozen).
   * @returns {Object} The current state, frozen to prevent modifications.
   */
  get = () => {
    if (this.#config.persist) {
      try {
        const stored = localStorage.getItem(this.#config.name);
        return Object.freeze(stored ? JSON.parse(stored) : this.#state);
      } catch (e) {
        console.error("Error al parsear el estado desde localStorage:", e);
        return Object.freeze(this.#state);
      }
    }
    return Object.freeze(this.#state);
  };

  /**
   * Replaces the entire state with a new payload and notifies listeners.
   * If persistence is enabled, saves the new state to localStorage.
   * @param {Object} payload - The new state to set.
   */
  set = (payload) => {
    if (this.#config.persist) {
      try {
        localStorage.setItem(this.#config.name, JSON.stringify(payload));
      } catch (e) {
        console.error("Error al guardar el estado en localStorage:", e);
      }
    }
    this.#state = payload;
    this.#notify();
  };

  /**
   * Updates the state by merging a partial state with the current state and notifies listeners.
   * If persistence is enabled, saves the updated state to localStorage.
   * @param {Object} partialState - The partial state to merge with the current state.
   */
  update = (partialState) => {
    const newState = { ...this.#state, ...partialState };
    if (this.#config.persist) {
      try {
        localStorage.setItem(this.#config.name, JSON.stringify(newState));
      } catch (e) {
        console.error("Error al guardar el estado en localStorage:", e);
      }
    }
    this.#state = newState;
    this.#notify();
  };

  /**
   * Clears the state, resetting it to an empty object and notifies listeners.
   * If persistence is enabled, removes the state from localStorage.
   */
  clear = () => {
    if (this.#config.persist) {
      localStorage.removeItem(this.#config.name);
    }
    this.#state = {};
    this.#notify();
  };

  /**
   * Subscribes a callback to be notified whenever the state changes.
   * The callback is called immediately with the current state upon subscription.
   * @param {Function} callback - The callback function to be called with the updated state.
   * @returns {Function} A function to unsubscribe the callback.
   * @throws {Error} If the callback is not a function.
   */
  subscribe = (callback) => {
    if (typeof callback !== "function") {
      throw new Error("El callback debe ser una función.");
    }
    this.#listeners.add(callback);
    callback(this.#state); // Call callback immediately with current state
    return () => this.#listeners.delete(callback);
  };

  /**
   * Notifies all subscribed listeners with the current state.
   * @private
   */
  #notify = () => {
    this.#listeners.forEach((listener) => listener(this.#state));
  };
}

export default Store;
