import { Express } from 'express';
import addProductAPI from './APIs/product/addProductAPI';
// import addClientAPI from './APIs/client/addClientAPI';
import addhoftestAPI from './APIs/hoftest/addhoftestAPI';

export default function addAPIs(app: Express) {
    addProductAPI(app);
    // addClientAPI(app);
    addhoftestAPI(app);
}
