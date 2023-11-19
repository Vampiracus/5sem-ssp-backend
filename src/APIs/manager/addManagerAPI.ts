import { Express } from 'express';
import apiHOF from '../apiHOF/apiHOF';
import managerErrorInterpreter from './managerErrorInterpreter';
import { isManager } from '../../cookies/cookies';
import { managerURL } from '../url';

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
        managerURL,
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
