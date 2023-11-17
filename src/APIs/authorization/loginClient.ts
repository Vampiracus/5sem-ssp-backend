/* eslint-disable no-undef */
import { Express } from 'express';
import { v4 as uuidv4 } from 'uuid';
import getUserByCookie from '../../cookies/cookies';
import postCookie from '../../cookies/postCookie';

async function authorizationAttemptClient(login: string, password: string): Promise<User | null> {
    const sql = 'SELECT * FROM client WHERE login = ? AND password = ?';
    const query = global.mysqlconn.format(sql, [login, password]);
    const res = await new Promise((resolve, reject) => {
        global.mysqlconn.query(query, (err, res) => {
            if (err) reject(err);
            if (res.length === 0) resolve(null);
            resolve(res[0]);
        });
    }) as User;
    return res;
}

export default function addLoginClientAPI(app: Express) {
    app.post('/login/client', async (req, res) => {
        await getUserByCookie(req.cookies.usercookie, req);
        if (req.user !== null) {
            res.status(400).send('User already authorized');
            return;
        }
        const { login, password } = req.body;
        try {
            req.user = await authorizationAttemptClient(login, password);
        } catch (e) {
            res.status(500).send('Something went wrong');
            console.log('ОШИБКА\n', e);
            return;
        }
        if (!req.user) {
            res.status(400).send('Incorrect login or password');
            return;
        }
        const cookie = uuidv4();
        
        req.user.user_type = 'client';
        req.user.cookie = cookie;
        try {
            postCookie(req.user);
        } catch (e) {
            res.status(500).send('Something went wrong');
            console.log('ОШИБКА\n', e);
            return;
        }
        res.cookie('usercookie', cookie, {
            httpOnly: true,
            secure: true,
            maxAge: 1000 * 60 * 60,
        });

        res.status(200).send('successful authorization');
    });
}
