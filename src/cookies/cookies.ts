import { Request } from 'express';

export default async function getUserByCookie(cookie: string, req: Request) {
    if (cookie === '') {
        req.user = null;
    } else try {
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
    } catch (e) {
        console.log(e);
    }
}

export async function isManager(req: Request): Promise<boolean> {
    try {
        await getUserByCookie(req.cookies.usercookie, req);
        if (!req.user || req.user.user_type !== 'manager') return false;
        return true;
    } catch (e) {
        return false;
    }
}

export async function isAuthorized(req: Request): Promise<boolean> {
    try {
        await getUserByCookie(req.cookies.usercookie, req);
        if (!req.user) return false;
        return true;
    } catch (e) {
        return false;
    }
}

export async function isOrderCreatedOrWaitingForChangesAndIsUserManagerOrSameUser_orderItem_delete(
    req: Request
): Promise<boolean> {
    try {
        await getUserByCookie(req.cookies.usercookie, req);
        if (!req.user) return false;
        if (req.user.user_type === 'manager') return true;
        const { id } = req.params;
        if (!id) return false;
        const sql = `
        SELECT client_login, status FROM _order JOIN order_item ON _order.id = order_item.order_id
        WHERE order_item.id = ?;
        `;
        const query = global.mysqlconn.format(sql, [id]);
        return await new Promise((resolve, reject) => {
            global.mysqlconn.query(query, (err, res) => {
                if (err) reject(err);
                if (!req.user
                    || res.length === 0
                    || res[0].client_login !== req.user.login
                    || (res[0].status !== 'created' && res[0].status !== 'waiting for changes'))
                    resolve(false);
                else resolve(true);
            });
        });
    } catch (e) {
        console.log(e);
        return false;
    }
}

export async function isOrderCreatedOrWaitingForChangesAndisUserManagerOrSameClient_orderItem_post(
    req: Request
): Promise<boolean> {
    try {
        await getUserByCookie(req.cookies.usercookie, req);
        if (!req.user) return false;
        if (req.user.user_type === 'manager') return true;
        const { order_id } = req.body;
        if (!order_id) return false;
        const sql = 'SELECT client_login, status FROM _order WHERE id = ?';
        const query = global.mysqlconn.format(sql, [order_id]);
        return await new Promise((resolve, reject) => {
            global.mysqlconn.query(query, (err, res) => {
                if (err) reject(err);
                if (!req.user || res.length === 0
                    || res[0].client_login !== req.user.login 
                    || (res[0].status !== 'created' && res[0].status !== 'waiting for changes'))
                    resolve(false);
                else resolve(true);
            });
        });
    } catch (e) {
        console.log(e);
        return false;
    }
}

export async function isManagerOrSameUser_order_patch(req: Request): Promise<boolean> {
    try {
        await getUserByCookie(req.cookies.usercookie, req);
        if (!req.user) return false;
        if (req.user.user_type === 'manager') return true;
        const { id } = req.params;
        if (!id) return false;
        const sql = 'SELECT client_login, status FROM _order WHERE id = ?';
        const query = global.mysqlconn.format(sql, [id]);
        return new Promise((resolve, reject) => {
            global.mysqlconn.query(query, (err, res) => {
                if (err) reject(err);
                if (!req.user || res.length === 0
                    || res[0].client_login !== req.user.login)
                    resolve(false);
                else resolve(true);
            });
        });
    } catch (e) {
        console.log(e);
        return false;
    }
}

export async function isOrderCreatedOrWaitingForChangesAndIsUserManagerOrSameUser_order_delete(
    req: Request
): Promise<boolean> {
    try {
        await getUserByCookie(req.cookies.usercookie, req);
        if (!req.user) return false;
        if (req.user.user_type === 'manager') return true;
        const { id } = req.params;
        if (!id) return false;
        const sql = 'SELECT client_login, status FROM _order WHERE id = ?';
        const query = global.mysqlconn.format(sql, [id]);
        return await new Promise((resolve, reject) => {
            global.mysqlconn.query(query, (err, res) => {
                if (err) reject(err);
                if (!req.user
                    || res.length === 0
                    || res[0].client_login !== req.user.login
                    || (res[0].status !== 'created' && res[0].status !== 'waiting for changes'))
                    resolve(false);
                else resolve(true);
            });
        });
    } catch (e) {
        console.log(e);
        return false;
    }
}

export async function isResponsibleManager(req: Request, orderId: string): Promise<boolean> {
    if (!(await isManager(req)) || !req.user) return false;
    const sql = 'SELECT manager_login FROM _order WHERE id = ?';
    const query = global.mysqlconn.format(sql, [orderId]);
    const neededLogin = await new Promise((resolve, reject) => {
        global.mysqlconn.query(query, (err, res) => {
            if (err) reject(err);
            if (res.length !== 1) resolve('');
            else resolve(res[0].manager_login);
        });
    });
    return req.user.login === neededLogin;
}
