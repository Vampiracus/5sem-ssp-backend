import { Express } from 'express';
import { isAuthorized } from '../../cookies/cookies';
import { getOrderItemsURL } from '../url';

export default function getOrderItems(app: Express) {
    app.get(getOrderItemsURL, async (req, res) => {
        try {
            const canGet = await isAuthorized(req);
            if (!canGet || !req.user) {
                res.status(401).send('');
                return;
            }
            const { orderid } = req.params;
            if (!orderid) {
                res.status(400).send('Не указан id заказа');
                return;
            }
            let sql: string;
            if (req.user.user_type === 'client') {
                sql = global.mysqlconn.format(`
                    SELECT i.id, i.product_count, i.order_id, i.product_id, p.name
                    FROM order_item i JOIN _order o ON i.order_id = o.id
                        JOIN product p ON p.id = i.product_id
                    WHERE o.client_login = ? and i.order_id =  ?;
                `, [req.user.login, orderid]);
            } else {
                sql = global.mysqlconn.format(`
                    SELECT * FROM order_item
                    WHERE order_id = ?;
                `, [orderid]);
            }
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
