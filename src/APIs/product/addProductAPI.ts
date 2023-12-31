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
            get: async () => true,
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
        },
        err => {
            const msg: string | undefined = (err as Record<string, any>).sqlMessage;
            if (msg && msg.match(/^Check constraint/))
                return 'Не проходят проверки ограничений целостностности';
            if (err.code && err.code === 'R_ROW_IS_REFERENCED_2') {
                return 'Этот товар нельзя удалить, потому что он уже заказан';
            }
        }
    );
}
