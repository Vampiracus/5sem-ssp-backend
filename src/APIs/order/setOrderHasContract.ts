import { Express } from 'express';
import { isManager } from '../../cookies/cookies';
import { managerSetsOrderContractURL } from '../url';

export default function setOrderHasContract(app: Express) {
    // Дата должна приходить в виде числа
    app.patch(managerSetsOrderContractURL, async (req, res) => {
        const canPatch = await isManager(req);
        if (!canPatch) {
            res.status(403).send('');
            return;
        }

        const { id } = req.params;
        const { contract } = req.body;
        let { contract_date } = req.body;
        if (!id || !contract || !contract_date) {
            res.status(400).send('Не выбран id заказа или не указаны номер контракта или его дата');
            return;
        }

        console.log(contract_date);
        contract_date = new Date(Number(contract_date)); // Дата должна приходить в виде числа
        if (isNaN(contract_date)) {
            res.status(400).send('Неправильная дата');
            return;
        }
        contract_date = contract_date.toISOString().slice(0, 19).replace('T', ' ');
        console.log(contract_date);

        let sql = 'SELECT status FROM _order WHERE id = ?';
        let query = global.mysqlconn.format(sql, [id]);
        global.mysqlconn.query(query, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send('Что-то пошло не так');
                return;
            }
            if (result.length === 0) {
                res.status(404).send('Некорректный id');
                return;
            }
            if (result[0].status !== 'processing (no contract)') {
                res.status(400).send('Статус заказа не processing (no contract)');
                return;
            }

            sql = `UPDATE _order SET
                   status = 'processing (no signature)',
                   contract = ?,
                   contract_date = ?
                   WHERE id = ${id}`;
            query = global.mysqlconn.format(sql, [contract, contract_date]);
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
