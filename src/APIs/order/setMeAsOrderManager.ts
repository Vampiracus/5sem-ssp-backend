import { Express } from 'express';
import { isManager } from '../../cookies/cookies';
import { managerSetOrderManagerURL } from '../url';
import mysql from 'mysql';

export default function setMeAsOrderManager(app: Express) {
    app.patch(managerSetOrderManagerURL, async (req, res) => {
        const con = mysql.createConnection({
            host: 'localhost',
            user: 'test',
            password: '',
            database: 'sspdb',
        });
        
        await new Promise((r, j) => {
            con.connect(err => {
                if (err) j(err);
                r('');
            });
        });

        const canPatch = await isManager(req);
        if (!canPatch) {
            res.status(403).send('');
            con.end();
            return;
        }

        const { id } = req.params;
        if (!id) {
            res.status(400).send('Не выбран id заказа');
            con.end();
            return;
        }

        await new Promise((r, j) => {
            con.query('LOCK TABLE _order write', e => {
                if (e) j(e);
                r('');
            });
        });

        let sql = 'SELECT manager_login FROM _order WHERE id = ?';
        let query = con.format(sql, [id]);
        con.query(query, (err, result) => {
            if (err || !req.user) {
                console.log(err);
                res.status(500).send('Что-то пошло не так');
                con.end();
                return;
            }
            if (result.length === 0) {
                res.status(404).send('Некорректный id');
                con.end();
                return;
            }
            if (result[0].manager_login !== null) {
                res.status(400).send('Кто-то уже работает над этим заказом');
                con.end();
                return;
            }

            setTimeout(() => {
                sql =  `UPDATE _order SET manager_login = ? 
                        WHERE id = ${id}`;
                query = con.format(sql, [req.user!.login]);
                con.query(query, err => {
                    if (err) {
                        console.log(err);
                        res.status(500).send('Что-то пошло не так');
                        con.end();
                        return;
                    }
                    res.status(200).send('OK');
                    con.end();
                });
            }, 0);
        });
    });
}
