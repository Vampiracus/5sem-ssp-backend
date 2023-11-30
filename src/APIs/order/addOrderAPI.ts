import { Express } from 'express';

import apiHOF from '../apiHOF/apiHOF';
import orderErrorInterpreter from './orderErrorInterpreter';
import { orderURL } from '../url';

import {
    isAuthorized,
    isManager
} from '../../cookies/cookies';

import userCreateOrder from './userCreateOrder';
import getOrdersWithoutContract from './getOrdersWithoutContract';
import setOrderWaitingForChanges from './setOrderWaitingForChanges';
import setOrderHasContract from './setOrderHasContract';
import setContractIsSigned from './setContractIsSigned';
import userDeleteOrder from './userDeleteOrder';
import getMyOrders from './getMyOrders';
import getOrderItems from './getOrderItems';
import setMeAsOrderManager from './setMeAsOrderManager';
import unsetMeAsOrderManager from './unsetMeAsOrderManager';
import setOrderIsReady from './setOrderIsReady';
import getShipped from './getShipped';
import setOrderIsFinished from './setOrderIsFinished';

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
        ['total', 'contract', 'contract_date', 'status', 'client_login', 'manager_login'],
        orderURL,
        {
            post: isAuthorized,
            get: isManager,
            put: isManager,
            delete: 'no delete',
        },
        (item, isPost) => {
            if (isPost && (item.id as unknown) !== 'NULL')
                return 'ID должно быть NULL';
            return true;
        },
        orderErrorInterpreter
    );

    userCreateOrder(app);
    userDeleteOrder(app);
    getOrdersWithoutContract(app);
    getMyOrders(app);
    getOrderItems(app);
    getShipped(app);

    setOrderWaitingForChanges(app);
    setOrderHasContract(app);
    setContractIsSigned(app);
    setOrderIsReady(app);
    setOrderIsFinished(app);

    setMeAsOrderManager(app);
    unsetMeAsOrderManager(app);
}
