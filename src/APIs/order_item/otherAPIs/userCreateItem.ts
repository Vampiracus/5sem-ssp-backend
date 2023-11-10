import { Express } from 'express';

export default function userCreateItem(app: Express) {
    app.patch('/order/create/:id', (req, res) => {
        const { id } = req.params;
        if (!id) {
            res.status(400).send('Не выбран id заказа');
            return;
        }
        let sql = 'SELECT status, total FROM _order WHERE id = ?';
        const query = global.mysqlconn.format(sql, [id]);
        global.mysqlconn.query(query, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send('Неудача');
                return;
            }
            if (result.length === 0) {
                res.status(400).send('Некорректный id');
                return;
            }
            if (result[0].status !== 'created') {
                res.status(400).send('Статус заказа не created');
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
                    res.status(500).send('Неудача');
                    return;
                }
                res.status(200).send('OK');
            });
        });
    });
}
