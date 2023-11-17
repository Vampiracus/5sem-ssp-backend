import express from 'express';
import mysql from 'mysql';
import cookieParser from 'cookie-parser';
import addAPIs from './addAPIs';

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'sspdb',
});

conn.connect(err => {
    if (err) throw err;
    console.log('Successfully connected to mysql!');
    (globalThis as any).mysqlconn = conn;
});

const PORT = 3000;

const app = express();
app.use(express.json());
app.use(cookieParser('bywbQy0zR9f5U8G'));
app.set('etag', false); // turn off
//@ts-ignore
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError) {
        return res.status(400).send('Bad request');
    }
    next();
});
//@ts-ignore
app.use((err, req, res, next) => {
    res.setHeader('Last-Modified', (new Date()).toUTCString());
    next();
});
app.use(function(_, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 'content-type');
    next();
});

addAPIs(app);

app.listen(PORT, () => {
    console.log(`Проект работает на порту ${PORT} \n`);
    console.log(`http://localhost:${PORT} \n`);
});
