
import express from 'express';
import path from 'path';
import { pinyin, addDict } from 'pinyin-pro';
import CompleteDict from '@pinyin-pro/data/complete';
import {toPallad, cyclePinyinPall, capitalizeFirstLetter} from './utils/converter/cnToPall.js';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;
const jsonParser = express.json();

addDict(CompleteDict);
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
    const ruText = cyclePinyinPall(pinyin(responseText, {toneType:'none', type: 'string', nonZh: 'consecutive', segmentit: 2,}), text.spaceBool);
    response.send(ruText);
});

app.listen(PORT, () => {
    console.log(`Сервер запущен! Перейди: http://localhost:${PORT}`);
    console.log("时：", new Date().toLocaleString());
});