import { Express } from 'express';
import { userDeletesOrderItemURL } from '../url';
// eslint-disable-next-line max-len
import { isOrderCreatedOrWaitingForChangesAndIsUserManagerOrSameUser_orderItem_delete } from '../../cookies/cookies';

export type OrderItem = {
    id: number,
    product_count: number,
    order_id: number,
    product_id: number
}

export default function deleteItem(app: Express) {
    app.delete(userDeletesOrderItemURL, async (req, res) => {
        const canDelete
        = await isOrderCreatedOrWaitingForChangesAndIsUserManagerOrSameUser_orderItem_delete(req);
        if (!canDelete) {
            res.status(403).send('');
            return;
        }

        const { id } = req.params;
        if (!id) {
            res.status(400).send('Не указан id строки заказа');
            return;
        }

        let sql = 'SELECT id, order_id, product_id, product_count FROM order_item WHERE id = ?';
        let query = global.mysqlconn.format(sql, [id]);
        try {
            const deletedItem: OrderItem = await new Promise((resolve, reject) => {
                global.mysqlconn.query(query, (err, result) => {
                    if (err) reject(err);
                    resolve(result[0]);
                });
            });

            sql = 'DELETE FROM order_item WHERE id = ?';
            query = global.mysqlconn.format(sql, [id]);

            global.mysqlconn.query(query, err => {
                if (err) {
                    console.log(err);
                    res.status(500).send('Что-то пошло не так');
                    return;
                }
                res.status(200).send('OK');

                sql = `
                    UPDATE _order SET total = total - ? * (
                        SELECT cost FROM product WHERE id = ?
                    )
                    WHERE id = ?
                `;
                query = global.mysqlconn.format(
                    sql,
                    [deletedItem.product_count, deletedItem.product_id, deletedItem.order_id]
                );

                global.mysqlconn.query(query, err => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                });
            });
        } catch (e) {
            res.status(500).send('Что-то пошло не так');
        }
    });
}
