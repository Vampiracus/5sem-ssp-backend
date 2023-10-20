import { Express } from 'express';
import postProduct from './post';
import getProducts from './get';
import putProduct from './put';

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

    app.put('/product', (req, res) => {
        const body = req.body;
        if (Object.keys(body).length == 0) {
            console.log(body);
            res.status(400).send('Послан не JSON-объект');
            return;
        }

        const insertionAttempt = putProduct(body);
        if (typeof insertionAttempt === 'string') {
            res.status(400).send(insertionAttempt);
        } else {
            insertionAttempt
                .then(() => {
                    res.status(200).send('OK');
                })
                .catch(err => {
                    console.log(err);
                    res.status(400).send('Не получилось изменить поля продукта');
                });
        }
    });

    app.get('/product', (_, res) => {
        const getAttempt = getProducts();
        getAttempt
            .then(products => {
                res.status(200).send(products);
            })
            .catch(() => {
                res.status(500).send('Не получилось получить продукты');
            });
    });
}
