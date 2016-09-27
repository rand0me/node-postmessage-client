import tape from 'tape';

import Client from '../src/lib/Client';

tape('browser', (t) => {

    t.equal(typeof Client, 'function', 'Client is a constructor');
    t.ok(new Client() instanceof Client, 'Constructor works');

    window.addEventListener('message', (e) => {
        t.pass('host window received message');

        const data = JSON.parse(e.data);
        data.message = 'OK';

        window.postMessage(JSON.stringify(data), '*');
    });

    const client = new Client();

    client.connect(window, window);
    client.get('test/route', {id: '1'}).then(data => {
        t.pass(`Message: ${data.message}`);
        t.end();
    }).catch(err => {
        console.error(err);
    });
});