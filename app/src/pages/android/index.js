import { syncedStore, getYjsDoc } from '@syncedstore/core';
import { MatrixProvider } from '@unimo/matrix-crdt';
import { useEffect } from 'react';
import sdk from 'matrix-js-sdk';
export let crypto = global.window?.crypto;
export default function Sync() {
    const userIdPath = 'synapse.nas.s4fu.com';
    const baseUrl = 'https://synapse.nas.s4fu.com';
    const roomAlias = '#test_public_plain:synapse.nas.s4fu.com';
    const store = syncedStore({ data: [] });
    const doc = getYjsDoc(store);
    if (!crypto) {
        try {
            crypto = require('crypto').webcrypto;
        } catch (e) {
            logger.error('Failed to load webcrypto', e);
        }
    }
    let provider, device;
    let login = false;
    let accessToken = false;
    let deviceId = false;

    let matrixClient = null;
    let run = false;

    const addEntry = (type, content) => {
        const timestamp = Date.now();
        store.data.push({ type: type, content: content, timestamp: timestamp, deviceId: device });
    };

    const updateEntry = (type, content) => {
        const timestamp = Date.now();
        // find the last entry with the same type and update it
        const index = store.data
            .slice()
            .reverse()
            .findIndex((entry) => entry.type === type);
        if (index === -1) {
            store.data.push({ type: type, content: content, timestamp: timestamp, deviceId: device });
        } else {
            store.data.splice(index, 1, { type: type, content: content, timestamp: timestamp, deviceId: device });
        }
    };

    const wipe = () => {
        store.data.splice(0, store.data.length);
    };

    const init = async () => {
        if (run) return;
        run = true;
        // todo remove later
        window.addEntry = addEntry;
        window.wipe = wipe;
        window.updateEntry = updateEntry;
        // fix this as for some reason useEffect (re-render) is called twice
        console.log = (message) => {
            let node = document.createElement('li'); // Create a <li> node
            let textnode = document.createTextNode(message); // Create a text node
            node.appendChild(textnode); // Append the text to <li>

            document.getElementById('myList').appendChild(node);
        };
        console.error = (message) => {
            let node = document.createElement('li'); // Create a <li> node
            let textnode = document.createTextNode(message); // Create a text node
            node.appendChild(textnode); // Append the text to <li>
            node.style.color = 'red';
            document.getElementById('myList').appendChild(node); // Append <li> to <ul> with id="myList"
        };
        console.log('login: ' + login);
        console.log('token: ' + accessToken);
        provider = new MatrixProvider(doc, matrixClient, {
            type: 'alias',
            alias: roomAlias,
        });
        await provider.initialize();
        device = matrixClient.getDeviceId();
        if (window.Android !== undefined) {
            window.Android.onReady();
        }
        const data = store.data.toJSON();
        console.log('dump:' + JSON.stringify(data, null, 2));
        doc.on('update', (update) => {
            console.log('update');
            const data = store.data.toJSON();
            console.log('dump:' + JSON.stringify(data, null, 2));
            if (window.Android !== undefined) {
                window.Android.update('update', JSON.stringify(data));
            }
        });
    };

    useEffect(() => {
        let params = new URLSearchParams(window.location.search);
        login = params.get('login');
        accessToken = params.get('token');
        deviceId = params.get('deviceId');
        if (!login || !accessToken || !deviceId) return;
        matrixClient = sdk.createClient({
            baseUrl: baseUrl,
            deviceId: deviceId,
            accessToken: accessToken,
            userId: '@' + login + ':' + userIdPath,
            isVoipWithNoMediaAllowed: false,
        });
        init().catch(console.error);
    }, []);
    return (
        <div>
            Android
            <ul id='myList'></ul>
        </div>
    );
}
