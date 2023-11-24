import { Express } from 'express';
import { isManager } from '../../cookies/cookies';
import { managerUnsetOrderManagerURL } from '../url';

export default function unsetMeAsOrderManager(app: Express) {
    app.patch(managerUnsetOrderManagerURL, async (req, res) => {
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

        const sql = 'SELECT manager_login FROM _order WHERE id = ?';
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
            if (result[0].manager_login !== req.user.login) {
                res.status(400).send('Над этим заказом работает другой менеджер');
                return;
            }

            query = `UPDATE _order SET
                   manager_login = NULL
                   WHERE id = ${id}`;
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
