import { Express } from 'express';
import apiHOF from '../apiHOF/apiHOF';
import orderItemErrorInterpreter from './orderItemErrorInterpreter';
import { isManager } from '../../cookies/cookies';
import { order_itemURL } from '../url';
import postNewItem from './postNewItem';
import deleteItem, { OrderItem } from './deleteItem';

export default function (app: Express) {

    apiHOF<OrderItem>(
        app,
        'order_item',
        'id',
        ['product_count', 'order_id', 'product_id'],
        order_itemURL,
        {
            post: 'no post',
            get: isManager,
            put: isManager,
            delete: 'no delete',
        },
        (item, isPost) => {
            if (isPost && (item.id as unknown) !== 'NULL')
                return 'ID должно быть NULL';
            return true;
        },
        orderItemErrorInterpreter
    );

    postNewItem(app);
    deleteItem(app);
}
