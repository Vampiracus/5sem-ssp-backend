import { Express } from 'express';
import apiHOF from '../apiHOF/apiHOF';
import orderItemErrorInterpreter from './orderItemErrorInterpreter';

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
        (item, isPost) => {
            if (isPost && (item.id as unknown) !== 'NULL')
                return 'ID должно быть NULL';
            return true;
        },
        orderItemErrorInterpreter
    );
}
