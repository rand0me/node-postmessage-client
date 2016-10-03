import tape from 'tape';

import Client from '../src/lib/Client';

tape('browser', (t) => {
    t.plan(4);

    t.equal(typeof Client, 'function', 'Client is a constructor');
    t.ok(new Client() instanceof Client, 'Constructor works');

    window.addEventListener('message', (e) => {
        const data = JSON.parse(e.data);

        if (data.type === 'RESPONSE') {
            return;
        }

        t.pass('host window received message');

        data.message = 'OK';
        data.type = 'RESPONSE';

        e.source.postMessage(JSON.stringify(data), '*');
    });

    const client = new Client();

    client.connect(window, window)
        .get('test/route', {id: '1'})
        .then(data => t.pass(`Message: ${data.message}`))
        .catch(err => console.error(err));
});