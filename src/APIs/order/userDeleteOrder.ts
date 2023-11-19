import { Express } from 'express';
// eslint-disable-next-line max-len
import { isOrderCreatedOrWaitingForChangesAndIsUserManagerOrSameUser_order_delete } from '../../cookies/cookies';
import { userDeletesOrderURL } from '../url';

export default function userDeleteOrder(app: Express) {
    app.delete(userDeletesOrderURL, async (req, res) => {
        // eslint-disable-next-line max-len
        const canDelete = await isOrderCreatedOrWaitingForChangesAndIsUserManagerOrSameUser_order_delete(req);  // id is checked here
        if (!canDelete) {
            res.status(403).send('');
            return;
        }

        const { id } = req.params;
        if (!id) {
            res.status(400).send('Не выбран id заказа');
            return;
        }

        const deleteItemtsSql = `DELETE FROM order_item WHERE order_id = ${id}`;
        const deleteOrderSql = `DELETE FROM _order WHERE id = ${id}`;
        try {
            await new Promise((resolve, reject) => {
                global.mysqlconn.query(deleteItemtsSql, err => {
                    if (err) reject(err);
                    global.mysqlconn.query(deleteOrderSql, err => {
                        if (err) reject(err);
                        resolve('OK');
                    });
                });
            });
            res.status(200).send('OK');
        } catch (e) {
            console.log(e);
            res.status(400).send('Не получилось удалить. Проверьте целостность данных');
        }
    });
}
