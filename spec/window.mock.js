const instances = [];

export default class WindowMock {
    constructor() {
        this.listeners = [];
        this.location = {
            host: 'localhost'
        }
    }

    addEventListener(type, listener, useCapture) {
        if (type !== 'message') {
            throw Error('Event type must be a "message"')
        }

        if (typeof listener !== 'function') {
            throw Error('Listener must be a function')
        }

        this.listeners.push(listener);

        return this;
    }

    postMessage(data, targetOrigin, transfer) {
        this.listeners.forEach((listener) => listener({data: data}));
    }
}

WindowMock.create = () => {
    const mock = new WindowMock();
    instances.push(mock);

    return mock;
};