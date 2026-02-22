const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;
app.use(express.static(__dirname));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.use((req, res, next) => {
    console.log(`Пришел запрос: ${req.method} ${req.url}`);
    next();
});

app.listen(PORT, () => {
    console.log(`Сервер запущен! Перейди: http://localhost:${PORT}`);
    console.log("大家好！我是backend-dev");
    console.log("时：", new Date().toLocaleString());
});