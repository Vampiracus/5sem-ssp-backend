import { Express } from 'express';
import { isManager } from '../../cookies/cookies';
import { ordersNoContractURL } from '../url';

export default function getOrdersWithoutContract(app: Express) {
    app.get(ordersNoContractURL, async (req, res) => {
        try {
            const canGet = await isManager(req);
            if (!canGet) {
                res.status(403).send('');
                return;
            }
            const sql = `
            SELECT * FROM _order
            WHERE status = 'processing (no contract)'
            LIMIT 50
            `; // getting only 50 in order not to overload the web
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
