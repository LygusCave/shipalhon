
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import {toPallad, cyclePinyinPall, capitalizeFirstLetter} from './utils/converter/cnToPall.js';
import {jpToPol} from './utils/converter/jpToPoL.js';
import fs from 'fs';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const SOCKET_PATH = '/var/www/shipalhon.ru/data/nodejs/0.sock';
const jsonParser = express.json();

app.use((req, res, next) => {
    console.log(`Пришел запрос: ${req.method} ${req.url}`);
    next();
});
app.use(express.static(path.join(__dirname, 'front')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'front', 'index.html'));
});

app.post("/transcriptCN", jsonParser, function (request, response) {
    const text = request.body;
    if(!text) return response.sendStatus(400);
    const responseText = text.utext;
    const ruText = cyclePinyinPall(responseText, text.spaceBool,text.erhuaBool);
    response.send(ruText);
});
app.post("/transcriptJP", jsonParser, function (request, response) {
    const text = request.body;
    if(!text) return response.sendStatus(400);
    const responseText = text.utext;
    const ruText = jpToPol(responseText, true, text.spaceBool);
    response.send(ruText);
});
if (fs.existsSync(SOCKET_PATH)) {
    try {
        fs.unlinkSync(SOCKET_PATH);
        console.log('Старый сокет удален для перезапуска');
    } catch (err) {
        console.error('Не удалось удалить сокет:', err);
    }
}

app.listen(SOCKET_PATH, () => {
    // Устанавливаем права 666 (как на скрине), чтобы Nginx мог подключиться
    fs.chmodSync(SOCKET_PATH, '0666');
    console.log(`Сервер слушает сокет: ${SOCKET_PATH}`);
});