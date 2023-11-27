import { Express } from 'express';
import { isManager } from '../../cookies/cookies';
import { getOrderShippedURL } from '../url';

export default function getShipped(app: Express) {
    app.get(getOrderShippedURL, async (req, res) => {
        try {
            const canGet = await isManager(req);
            if (!canGet || !req.user) {
                if (!req.user)
                    res.status(401).send('');
                else
                    res.status(403).send('');
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
                    SELECT oi.id, oi.order_id, sum(shipped_count) shipped FROM shipment
                    JOIN order_item oi on shipment.order_item_id = oi.id
                    WHERE oi.order_id = ? and client_login = ?
                    GROUP BY shipment.order_item_id
                `, [orderid, req.user.login]);
            } else {
                sql = global.mysqlconn.format(`
                    SELECT oi.id, oi.order_id, sum(shipped_count) shipped FROM shipment
                    JOIN order_item oi on shipment.order_item_id = oi.id
                    WHERE oi.order_id = ?
                    GROUP BY shipment.order_item_id
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
