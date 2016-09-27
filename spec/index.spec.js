import tape from 'tape';

import Client from '../src';
import WindowMock from './window.mock';

tape('main', (t) => {
    t.plan(4);

    t.equal(typeof Client, 'function', 'Client is a constructor');
    t.ok(new Client() instanceof Client, 'Constructor works');

    const hostWindow = new WindowMock();
    const thisWindow = new WindowMock();

    hostWindow.addEventListener('message', (e) => {
        t.pass('host window received message');

        const data = JSON.parse(e.data);
        data.message = 'OK';

        thisWindow.postMessage(JSON.stringify(data));
    });

    const client = new Client();

    client.connect(thisWindow, hostWindow);
    client.get('test/route', {id: '1'}).then(data => {
        t.pass(`Message: ${data.message}`);
    })
        .catch(err => console.error(err));
});