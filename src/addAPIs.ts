import { Express } from 'express';
import addProductAPI from './APIs/product/addProductAPI';

export default function addAPIs(app: Express) {
    app.get('/sum', (req, res) => {
        res.send((Number(req.query.a) + Number(req.query.b)).toString());
    });

    addProductAPI(app);
}
