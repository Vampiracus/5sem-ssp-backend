import { Express } from 'express';
import apiHOF from '../apiHOF/apiHOF';

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
        err => {
            if (err.code === 'ER_DUP_ENTRY') return 'Такой логин уже есть!'; 
        });
}
