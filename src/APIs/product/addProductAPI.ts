import { Express } from 'express';
import postProduct from './post';

export default function (app: Express) {
    app.post('/product', (req, res) => {
        const body = req.body;
        if (Object.keys(body).length == 0) {
            console.log(body);
            res.status(400).send('Послан не JSON-объект');
            return;
        }

        const insertionAttempt = postProduct(body);
        if (typeof insertionAttempt === 'string') {
            res.status(400).send(insertionAttempt);
        } else {
            insertionAttempt
                .then(() => {
                    res.status(201).send('OK');
                })
                .catch(() => {
                    res.status(400).send('Не получилось добавить продукт в базу данных');
                });
        }
    });
}
