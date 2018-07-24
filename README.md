postmessage-client [![Build Status]](https://travis-ci.org/rand0me/node-postmessage-client)
==========================================

[![Greenkeeper badge](https://badges.greenkeeper.io/rand0me/node-postmessage-client.svg)](https://greenkeeper.io/)

[![NPM]](https://nodei.co/npm/postmessage-client/)

## Installation
```
npm install --save postmessage-client
```

## Usage

You must use this module with postmessage-server module on the other side (remote window)

### es6
```javascript
import Client from '../src';

const client = new Client();

client.connect(window, window.opener);
client.get('test/route', {id: '1'}).then(data => {
    console.log(data);
});
```

### es5
```javascript
var PMClient = require('postmessage-client');

var client = new PMClient();
client.connect(window.opener);
client.get('test/route').then(function (data) {
    console.log(data);
});
```

[Build Status]: https://travis-ci.org/rand0me/node-postmessage-client.svg?branch=master
[NPM]: https://nodei.co/npm/postmessage-client.png
