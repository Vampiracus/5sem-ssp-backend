import { Request } from 'express';

export default async function getUserByCookie(cookie: string, req: Request) {
    if (!cookie) {
        req.user = null;
    } else {
        let sql = 'SELECT * FROM session WHERE cookie = ?';
        let query = global.mysqlconn.format(sql, [cookie]);
        req.user = await new Promise((resolve, reject) => {
            global.mysqlconn.query(query, (err, res) => {
                if (err) reject(err);
                if (res.length === 0) resolve(null);
                resolve(res[0]);
            });
        });

        if (!req.user) {
            req.user = null;
            return;
        }

        if (req.user.user_type === 'client') {
            sql = 'SELECT * FROM client WHERE login = ?';
            query = global.mysqlconn.format(sql, [req.user.client_login]);
        } else {
            sql = 'SELECT * FROM manager WHERE login = ?';
            query = global.mysqlconn.format(sql, [req.user?.manager_login]);
        }
        const usr = await new Promise((resolve, reject) => {
            global.mysqlconn.query(query, (err, res) => {
                if (err) reject(err);
                if (res.length === 0) resolve(null);
                resolve(res[0]);
            });
        });

        if (usr === null) req.user = null;
        else Object.assign(req.user as Record<string, any>, usr);
    }
}
