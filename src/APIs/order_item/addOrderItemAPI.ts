import { Express } from 'express';
import apiHOF from '../apiHOF/apiHOF';
import orderItemErrorInterpreter from './orderItemErrorInterpreter';
import { isAuthorized, isManager } from '../../cookies/cookies';

type OrderItem = {
    id: number,
    product_count: number,
    order_id: number,
    product_id: number
}

export default function (app: Express) {

    apiHOF<OrderItem>(
        app,
        'order_item',
        'id',
        ['product_count', 'order_id', 'product_id'],
        '/order/item',
        {
            post: isAuthorized,
            get: isManager,
            put: isManager,
        },
        (item, isPost) => {
            if (isPost && (item.id as unknown) !== 'NULL')
                return 'ID должно быть NULL';
            return true;
        },
        orderItemErrorInterpreter
    );
}
