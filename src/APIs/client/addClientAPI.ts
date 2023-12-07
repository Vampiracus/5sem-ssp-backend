import { Express } from 'express';
import apiHOF from '../apiHOF/apiHOF';
import clientErrorInterpreter from './clientErrorInterpreter';
import { isAuthorized, isManager } from '../../cookies/cookies';
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
            post: async req => !(await isAuthorized(req)),
            get: isManager,
            put: isManager,
            delete: isManager,
        },
        undefined,
        clientErrorInterpreter
    );
}
