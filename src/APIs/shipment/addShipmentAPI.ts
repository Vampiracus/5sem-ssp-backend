import { Express } from 'express';
import apiHOF from '../apiHOF/apiHOF';

type Shipment = {
    id: number,
    shipped_count: number,
    order_item_id: number,
    date: string,
    manager_login: string,
}

export default function (app: Express) {
    apiHOF<Shipment>(
        app,
        'shipment',
        'id',
        ['date', 'shipped_count', 'manager_login', 'order_item_id'],
        '/shipment',
        (shipment, isPost) => {
            if (isPost && (shipment.id as unknown) !== 'NULL')
                return 'ID должно быть NULL';
            return true;
        }
    );
}
