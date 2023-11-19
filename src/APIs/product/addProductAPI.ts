import { Express } from 'express';
import apiHOF from '../apiHOF/apiHOF';
import { isManager } from '../../cookies/cookies';
import { productURL } from '../url';

type Product = {
    id: number,
    cost: number,
    name: string
}

export default function (app: Express) {
    apiHOF<Product>(
        app,
        'product',
        'id',
        ['cost', 'name'],
        productURL,
        {
            post: isManager,
            get: isManager,
            put: isManager,
            delete: isManager,
        },
        (product, isPost) => {
            if (product.cost < 0) {
                return 'Цена не может быть отрицательной';
            }
            if (isPost && (product.id as unknown) !== 'NULL')
                return 'ID должно быть NULL';
            return true;
        }
    );
}
