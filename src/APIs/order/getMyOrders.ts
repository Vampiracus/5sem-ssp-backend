import { Express } from 'express';
import { isAuthorized } from '../../cookies/cookies';

export default function getMyOrders(app: Express) {
    app.get('/order/my', async (req, res) => {
        try {
            const canGet = await isAuthorized(req);
            if (!canGet || !req.user) {
                res.status(401).send('');
                return;
            }
            if (req.user.user_type !== 'client') {
                res.status(400).send('У менеджера нет своих заказов');
                return;
            }
            const sql = global.mysqlconn.format(`
            SELECT * FROM _order
            WHERE client_login = ?
            LIMIT 50
            `, [req.user.login]); // В будущем добавить пагинацию!!
            const result = await new Promise((resolve, reject) => {
                global.mysqlconn.query(sql, (dberr, dbres) => {
                    if (dberr) reject(dberr);
                    resolve(dbres);
                });
            });
            res.status(200).send(result);
        } catch (e) {
            console.log(e);
            res.status(500).send('Что-то пошло не так');
        }

    });
}
