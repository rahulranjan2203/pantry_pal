// backend/test_auth.js
// const axios = require('axios'); // Unused
// Using fetch for Node 18+ or generic request
const http = require('http');

function postRequest(path, data) {
    return new Promise((resolve, reject) => {
        const dataString = JSON.stringify(data);
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: '/api' + path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': dataString.length
            }
        };
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(body) }));
        });
        req.on('error', (e) => reject(e));
        req.write(dataString);
        req.end();
    });
}

async function test() {
    console.log("Testing Auth...");
    const username = 'testuser_' + Date.now();
    const password = 'password123';

    // 1. Register
    try {
        console.log(`\n1. Registering user: ${username}`);
        const regRes = await postRequest('/register', { username, password });
        console.log('Response:', regRes);
    } catch (e) { console.error('Register Error:', e); }

    // 2. Login
    try {
        console.log(`\n2. Logging in...`);
        const loginRes = await postRequest('/login', { username, password });
        console.log('Response:', loginRes);

        if (loginRes.body.token) {
            console.log("SUCCESS: Token received.");
        } else {
            console.log("FAILURE: No token.");
        }
    } catch (e) { console.error('Login Error:', e); }

    // 3. Login wrong password
    try {
        console.log(`\n3. Logging in with wrong password...`);
        const failRes = await postRequest('/login', { username, password: 'wrongpassword' });
        console.log('Response:', failRes);
    } catch (e) { console.error('Login Fail Error:', e); }
}

test();
