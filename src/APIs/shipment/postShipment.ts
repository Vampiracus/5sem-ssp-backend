import { Express } from 'express';
import { shipmentURL } from '../url';
// eslint-disable-next-line max-len
import { isResponsibleManager } from '../../cookies/cookies';

function getUnshipped(oiID: string) {
    const sql = global.mysqlconn.format(`
        SELECT oi.product_count - IFNULL(sum(s.shipped_count), 0) unshipped
        FROM order_item oi LEFT JOIN shipment s ON oi.id = s.order_item_id
        WHERE oi.id = ?
        GROUP BY s.order_item_id
    `, [oiID]);
    return new Promise<number>((resolve, reject) => {
        global.mysqlconn.query(sql, (err, res) => {
            if (err) reject(err);
            resolve(res[0].unshipped);
        });
    });
}

export default function postShipment(app: Express) {
    app.post(shipmentURL, async (req, res) => {
        try {
            const body = req.body;
            const columns = ['date', 'shipped_count', 'manager_login', 'order_item_id'];
            for(const column of columns) {
                if (!(column in body)) {
                    res.status(400).send(`Передан невалидный JSON-объект: нет поля ${column}`);
                    return;
                }
            }

            let sql = 'SELECT order_id FROM order_item WHERE id = ?';
            let query = global.mysqlconn.format(sql, [body.order_item_id]);
            const { order_id } = await new Promise<{ order_id: string }>((resolve, reject) => {
                global.mysqlconn.query(query, (err, dbres) => {
                    if (err) reject(err);
                    resolve(dbres[0]);
                });
            });

            const canPost = await isResponsibleManager(req, order_id);
            if (!canPost) {
                res.status(403).send('');
                return;
            }

            const unshipped = await getUnshipped(body.order_item_id);
            if (body.shipped_count > unshipped) {
                res.status(400).send('Попытка отгрузить больше товара, чем указано в заказе');
                return;
            }

            sql = 'INSERT shipment VALUES(NULL, ?, ?, ?, ?)';
            query = global.mysqlconn.format(
                sql,
                [body.date, body.shipped_count, body.manager_login, body.order_item_id]
            );
            global.mysqlconn.query(query, err => {
                if (err) {
                    console.log(err);
                    res.status(500).send('Что-то пошло не так');
                    return;
                }
                res.status(201).send('OK');
            });
        } catch (e) {
            console.log(e);
            res.status(500).send('Что-то пошло не так');
        }
    });
}
