import { Express } from 'express';
import { isManager } from '../../cookies/cookies';
import { managerSetsOrderContractIsSignedURL } from '../url';

export default function setContractIsSigned(app: Express) {
    // Дата должна приходить в виде числа
    app.patch(managerSetsOrderContractIsSignedURL, async (req, res) => {
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
                res.status(500).send('Что-то пошло не так');
                return;
            }
            if (result.length === 0) {
                res.status(404).send('Некорректный id');
                return;
            }
            if (result[0].status !== 'processing (no signature)') {
                res.status(400).send('Статус заказа не processing (no signature)');
                return;
            }

            sql = `UPDATE _order SET
                   status = 'processing'
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
