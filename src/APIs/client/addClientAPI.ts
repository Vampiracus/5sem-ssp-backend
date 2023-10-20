import { Express } from 'express';
import postClient from './post';

export default function (app: Express) {
    app.post('/client', (req, res) => {
        const body = req.body;
        if (Object.keys(body).length == 0) {
            console.log(body);
            res.status(400).send('Послан не JSON-объект');
            return;
        }

        const insertionAttempt = postClient(body);
        if (typeof insertionAttempt === 'string') {
            res.status(400).send(insertionAttempt);
        } else {
            insertionAttempt
                .then(() => {
                    res.status(201).send('OK');
                })
                .catch((err: any) => {
                    if (typeof err === 'string') {
                        res.status(400).send(err);
                        return;
                    }
                    res.status(400).send('Не получилось добавить клиента в базу данных');
                });
        }
    });
}
