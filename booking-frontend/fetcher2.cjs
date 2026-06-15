const https = require('https');
const fs = require('fs');
const url = process.argv[2];
const output = process.argv[3];

const options = {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
};

https.get(url, options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        fs.writeFileSync(output, data, 'utf8');
    });
}).on('error', (err) => {
    console.error(err);
});
