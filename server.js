
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import {toPallad, cyclePinyinPall, capitalizeFirstLetter} from './utils/converter/cnToPall.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = 10000;
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
    console.log(text);
    if(!text) return response.sendStatus(400);
    const responseText = text.utext;
    const ruText = cyclePinyinPall(responseText, text.spaceBool,text.erhuaBool);
    response.send(ruText);
});

app.listen(PORT, () => {
    console.log(`Сервер запущен! Перейди: http://localhost:${PORT}`);
    console.log("时：", new Date().toLocaleString());
});