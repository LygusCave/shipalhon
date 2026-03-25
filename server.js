
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import {toPallad, cyclePinyinPall, capitalizeFirstLetter} from './utils/converter/cnToPall.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const SOCKET_PATH = path.join(__dirname, 'server.sock');
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
if (fs.existsSync(SOCKET_PATH)) {
    fs.unlinkSync(SOCKET_PATH);
}
app.listen(SOCKET_PATH, () => {
    fs.chmodSync(SOCKET_PATH, '0666'); 
    
    console.log(`Сервер запущен через сокет: ${SOCKET_PATH}`);
    console.log("时：", new Date().toLocaleString());
});