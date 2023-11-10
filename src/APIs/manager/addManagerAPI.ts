import { Express } from 'express';
import apiHOF from '../apiHOF/apiHOF';
import managerErrorInterpreter from './managerErrorInterpreter';
import { isManager } from '../../cookies/cookies';

type Manager = {
    login: string,
    password: string,
    name: string,
}

export default function (app: Express) {

    apiHOF<Manager>(
        app,
        'manager',
        'login',
        ['name', 'password'],
        '/manager',
        {
            post: isManager,
            get: isManager,
            put: isManager,
            delete: isManager,
        },
        undefined,
        managerErrorInterpreter
    );
}
