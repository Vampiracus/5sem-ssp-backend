import { Express } from 'express';
import addProductAPI from './APIs/product/addProductAPI';
import addClientAPI from './APIs/client/addClientAPI';
import addManagerAPI from './APIs/manager/addManagerAPI';
import addOrderAPI from './APIs/order/addOrderAPI';
import addOrderItemAPI from './APIs/order_item/addOrderItemAPI';
import addShipmentAPI from './APIs/shipment/addShipmentAPI';
import addAuthAPI from './APIs/authorization/addAuthAPI';

export default function addAPIs(app: Express) {
    addProductAPI(app);
    addClientAPI(app);
    addManagerAPI(app);
    addOrderAPI(app);
    addOrderItemAPI(app);
    addShipmentAPI(app);
    
    addAuthAPI(app);
}
