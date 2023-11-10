import { Express } from 'express';
import apiHOF from '../apiHOF/apiHOF';
import { isManager } from '../../cookies/cookies';

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
        {
            post: isManager,
            get: isManager,
            put: isManager,
        },
        (shipment, isPost) => {
            if (isPost && (shipment.id as unknown) !== 'NULL')
                return 'ID должно быть NULL';
            return true;
        }
    );
}
