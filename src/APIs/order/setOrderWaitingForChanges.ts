import { Express } from 'express';
import { isManager } from '../../cookies/cookies';

export default function setOrderWaitingForChanges(app: Express) {
    app.patch('/order/wait_for_changes/:id', async (req, res) => {
        const canPatch = await isManager(req);
        if (!canPatch) {
            res.status(403).send('');
            return;
        }

        const { id } = req.params;
        if (!id) {
            res.status(400).send('Не выбран id заказа');
            return;
        }
        let sql = 'SELECT status FROM _order WHERE id = ?';
        const query = global.mysqlconn.format(sql, [id]);
        global.mysqlconn.query(query, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send('Неудача');
                return;
            }
            if (result.length === 0) {
                res.status(404).send('Некорректный id');
                return;
            }
            if (result[0].status !== 'processing (no contract)') {
                res.status(400).send('Статус заказа не processing (no contract)');
                return;
            }

            sql = `UPDATE _order SET status = 'waiting for changes' WHERE id = ${id}`;
            global.mysqlconn.query(sql, err => {
                if (err) {
                    console.log(err);
                    res.status(500).send('Неудача');
                    return;
                }
                res.status(200).send('OK');
            });
        });
    });
}
