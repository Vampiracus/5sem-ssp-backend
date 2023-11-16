import { Express } from 'express';
import getUserByCookie from '../../cookies/cookies';

export default function addUserAPI(app: Express) {
    app.get('/user', async (req, res) => {
        await getUserByCookie(req.cookies.usercookie, req);
        if (req.user) {
            const returned = {
                login: req.user.login,
                name: req.user.name,
                expirationDate: req.user.expiration_date,
                userType: req.user.user_type,
            };
            res.status(200).send(JSON.stringify(returned));
        } else {
            res.status(200).send('null');
        }
    });
}
