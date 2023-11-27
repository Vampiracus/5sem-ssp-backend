import { Express } from 'express';
import { order_itemURL } from '../url';
// eslint-disable-next-line max-len
import { isOrderCreatedOrWaitingForChangesAndisUserManagerOrSameClient_orderItem_post } from '../../cookies/cookies';

export default function postNewItem(app: Express) {
    app.post(order_itemURL, async (req, res) => {
        const canPost
        = await isOrderCreatedOrWaitingForChangesAndisUserManagerOrSameClient_orderItem_post(req);
        if (!canPost) {
            res.status(403).send('');
            return;
        }

        const body = req.body;
        const columns = ['id', 'product_count', 'order_id', 'product_id'];
        for(const column of columns) {
            if (!(column in body)) {
                return `Передан невалидный JSON-объект: нет поля ${column}`;
            }
        }

        let sql = 'INSERT order_item VALUES(NULL, ?, ?, ?)';
        let query
            = global.mysqlconn.format(sql, [body.product_count, body.order_id, body.product_id]);
        global.mysqlconn.query(query, err => {
            if (err) {
                console.log(err);
                res.status(500).send('Что-то пошло не так');
                return;
            }
            res.status(201).send('OK');

            sql = `
                UPDATE _order SET total = total + ? * (
                    SELECT cost FROM product WHERE id = ?
                )
                WHERE id = ?
            `;
            query = global.mysqlconn.format(
                sql,
                [body.product_count, body.product_id, body.order_id]
            );

            global.mysqlconn.query(query, err => {
                if (err) {
                    console.log(err);
                    return;
                }
            });
        });
    });
}
