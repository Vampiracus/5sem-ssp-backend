import { Express } from 'express';
import apiHOF from '../apiHOF/apiHOF';
import clientErrorInterpreter from './clientErrorInterpreter';

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
        '/client',
        undefined,
        clientErrorInterpreter
    );
}
