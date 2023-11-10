import { Express } from 'express';
import makeCookieInvalid from '../../cookies/makeCookieInvalid';

export default function addLogoutAPI(app: Express) {
    app.post('/logout', async (req, res) => {
        if (!req.cookies.usercookie) {
            res.status(200).send('OK');
            return;
        }
        makeCookieInvalid(req.cookies.usercookie);
        res.cookie('usercookie', '');
        res.status(200).send('OK');
    });
}
