import { Express } from 'express';
import { isManager } from '../../cookies/cookies';
import { managerSetOrderManagerURL } from '../url';

export default function setMeAsOrderManager(app: Express) {
    app.patch(managerSetOrderManagerURL, async (req, res) => {
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

        let sql = 'SELECT manager_login FROM _order WHERE id = ?';
        let query = global.mysqlconn.format(sql, [id]);
        global.mysqlconn.query(query, (err, result) => {
            if (err || !req.user) {
                console.log(err);
                res.status(500).send('Что-то пошло не так');
                return;
            }
            if (result.length === 0) {
                res.status(404).send('Некорректный id');
                return;
            }
            if (result[0].manager_login !== null) {
                res.status(400).send('Кто-то уже работает над этим заказом');
                return;
            }

            sql = `UPDATE _order SET manager_login = ? WHERE id = ${id}`;
            query = global.mysqlconn.format(sql, [req.user.login]);
            global.mysqlconn.query(query, err => {
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
