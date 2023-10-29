import { Express } from 'express';
import apiHOF from '../apiHOF/apiHOF';
import orderErrorInterpreter from './orderErrorInterpreter';

type Order = {
    id: number,
    total: number,
    contact: string,
    contract_date: string,
    status: string,
    client_login: string
}

export default function (app: Express) {

    apiHOF<Order>(
        app,
        '_order',
        'id',
        ['total', 'contract', 'contract_date', 'status', 'client_login'],
        '/order',
        (item, isPost) => {
            if (isPost && (item.id as unknown) !== 'NULL')
                return 'ID должно быть NULL';
            return true;
        },
        orderErrorInterpreter
    );
}
