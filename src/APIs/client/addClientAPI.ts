import { Express } from 'express';
import apiHOF from '../apiHOF/apiHOF';
import clientErrorInterpreter from './clientErrorInterpreter';
import { isManager } from '../../cookies/cookies';
import { clientURL } from '../url';

type Client = {
    login: string,
    password: string,
    name: string,
    address: string,
    phone: string
}

export default function (app: Express) {

    apiHOF<Client>(
        app,
        'client',
        'login',
        ['name', 'password', 'address', 'phone'],
        clientURL,
        {
            post: isManager,
            get: isManager,
            put: isManager,
            delete: isManager,
        },
        undefined,
        clientErrorInterpreter
    );
}
