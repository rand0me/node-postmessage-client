import 'native-promise-only';

/**
 * postMessage Client
 */
export default class Client {
    constructor() {
        this.listeners = {};
        this.promises = {};
    }

    /**
     * Instantiate a connection to remote window object
     * @param thisWindow {object} a current window, which will be listened for response
     * @param remoteWindow {object}
     */
    connect(thisWindow, remoteWindow) {
        this.disconnect();

        if (!thisWindow || !thisWindow.addEventListener) {
            throw new TypeError('thisWindow must have "addEventListener" method');
        }

        if (!remoteWindow || !remoteWindow.postMessage) {
            throw new TypeError('remoteWindow must have "postMessage" method');
        }

        this.window = thisWindow;
        this.remoteWindow = remoteWindow;

        this.window.addEventListener('message', this.boundListener = data => this.listener(data));
    }

    /**
     * "Close" a connection to other window
     * This method removes EventListeners from current window
     */
    disconnect() {
        if (this.window) {
            this.window.removeEventListener('message', this.boundListener);
        }

        this.window = null;
        this.remoteWindow = null;
    }

    /**
     * Request a "server" with path and optional data object
     * @param path {string}
     * @param [data] {object}
     * @returns {Promise}
     */
    get(path, data) {
        if (!this.promises[path]) {
            return this.promises[path] = new Promise((resolve, reject) => {
                this.listeners[path] = {resolve, reject};
                data = data || {};
                data.path = path;
                this.remoteWindow.postMessage(JSON.stringify(data), '*');
            });
        }

        return this.promises[path];
    }

    /**
     * Listener
     * @param e {Event}
     * @private
     */
    listener(e) {
        const data = JSON.parse(e.data);

        // Ignore messages without path
        if (!data.path) {
            return;
        }

        // Ignore messages, we aren't subscribe
        if (!this.listeners[data.path]) {
            return;
        }

        if (data.error) {
            this.listeners[data.path].reject(data);
        } else {
            this.listeners[data.path].resolve(data);
        }
    }
}