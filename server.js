
import fs from 'fs';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import {toPallad, cyclePinyinPall, capitalizeFirstLetter} from './utils/converter/cnToPall.js';
import {jpToHiragana,jpToPol} from './utils/converter/jpToPoL.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const SOCKET_PATH = '/var/www/shipalhon.ru/data/nodejs/0.sock';
const jsonParser = express.json();

app.use((req, res, next) => {
    console.log(`Пришел запрос: ${req.method} ${req.url}`);
    next();
});
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'front')));
// Обработка конкретных путей в папке dist
app.get('/article/:name', (req, res) => {
    const articlePath = path.join(__dirname, 'dist', 'article', req.params.name, 'index.html');
    if (fs.existsSync(articlePath)) {
        res.sendFile(articlePath);
    } else {
        res.status(404).send('Статья не найдена');
    }
});

// Если вы планируете сделать SPA (Single Page Application) в будущем, 
// можно добавить этот костыль для всех GET запросов:
app.get('*', (req, res) => {
    // Проверяем, есть ли такой файл в dist/название/index.html
    const fallbackPath = path.join(__dirname, 'dist', req.path, 'index.html');
    if (fs.existsSync(fallbackPath)) {
        return res.sendFile(fallbackPath);
    }
    res.status(404).send('Страница не найдена');
});
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
app.post("/transcriptJP", jsonParser, async function (request, response) {
    const text = request.body;
    if(!text) return response.sendStatus(400);
    const responseText = text.utext;
    const ruText = await jpToPol(responseText, text.vowelLengthMacron, text.spaceBool);
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