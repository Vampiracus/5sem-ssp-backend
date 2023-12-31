import { Express } from 'express';
import { isManagerOrSameUser_order_patch } from '../../cookies/cookies';
import { userSendsOrderURL } from '../url';

export default function userCreateOrder(app: Express) {
    app.patch(userSendsOrderURL, async (req, res) => {
        const canPatch = await isManagerOrSameUser_order_patch(req); // gets user into req.user
        if (!canPatch) {
            res.status(403).send('');
            return;
        }

        const { id } = req.params;
        if (!id) {
            res.status(400).send('Не выбран id заказа');
            return;
        }
        let sql = 'SELECT status, total, client_login FROM _order WHERE id = ?';
        const query = global.mysqlconn.format(sql, [id]);
        global.mysqlconn.query(query, async (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send('Что-то пошло не так');
                return;
            }
            if (result.length === 0) {
                res.status(404).send('Некорректный id');
                return;
            }
            if (result[0].status !== 'created' && result[0].status !== 'waiting for changes') {
                res.status(400).send('Статус заказа не created и не waiting for changes');
                return;
            }
            if (!req.user
                || req.user.user_type !== 'manager' && result[0].client_login !== req.user.login) {
                res.status(403).send('');
                return;
            }
            if (result[0].total == 0) {
                res.status(400).send('Пустой заказ');
                return;
            }

            sql = `UPDATE _order SET status = 'processing (no contract)' WHERE id = ${id}`;
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
