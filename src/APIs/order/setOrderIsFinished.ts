import { Express } from 'express';
import { isResponsibleManager } from '../../cookies/cookies';
import { managerSetsOrderIsFinishedURL } from '../url';

export default function setOrderIsFinished(app: Express) {
    app.patch(managerSetsOrderIsFinishedURL, async (req, res) => {
        const { id } = req.params;
        if (!id) {
            res.status(400).send('Не выбран id заказа');
            return;
        }

        const canPatch = await isResponsibleManager(req, id);
        if (!canPatch) {
            res.status(403).send('');
            return;
        }

        let sql = 'SELECT status FROM _order WHERE id = ?';
        const query = global.mysqlconn.format(sql, [id]);
        global.mysqlconn.query(query, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send('Что-то пошло не так');
                return;
            }
            if (result.length === 0) {
                res.status(404).send('Некорректный id');
                return;
            }
            if (result[0].status !== 'ready') {
                res.status(400).send('Статус заказа не ready');
                return;
            }

            sql = `UPDATE _order SET
                   status = 'finished'
                   WHERE id = ${id}`;
            global.mysqlconn.query(sql, err => {
                if (err) {
                    console.log(err);
                    res.status(500).send('Что-то пошло не так');
                    return;
                }
                res.status(200).send('OK');
            });
        });
    });
}
