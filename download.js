export default async function handler(req, res) {
    const fileUrl = 'https://gamesense-revive.github.io/gamesense.exe';

    try {
        const response = await fetch(fileUrl);
        if (!response.ok) {
            return res.status(500).send('Не удалось загрузить файл с сервера');
        }

        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomName = '';
        const nameLength = 12; // Длина имени файла (без расширения)
        
        for (let i = 0; i < nameLength; i++) {
            randomName += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        const finalFilename = `${randomName}.exe`;

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="${finalFilename}"`);
        
        return res.status(200).send(buffer);

    } catch (error) {
        return res.status(500).json({ error: 'Ошибка сервера: ' + error.message });
    }
}