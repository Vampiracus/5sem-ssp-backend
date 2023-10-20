import { Express } from 'express';
import addProductAPI from './APIs/product/addProductAPI';
import addClientAPI from './APIs/client/addClientAPI';

export default function addAPIs(app: Express) {
    addProductAPI(app);
    addClientAPI(app);
}
