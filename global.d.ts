/* eslint-disable no-unused-vars */
import { Connection } from 'mysql';
export {};

declare global {
    var mysqlconn: Connection;

    type Manager = {
        user_type: 'manager',
        cookie: string,
        login: string,
        password: string,
        name: string,
        start_date: string,
        expiration_date: string,
        manager_login: string
    }
    
    type Client = {
        user_type: 'client',
        cookie: string,
        login: string,
        password: string,
        name: string,
        address: string,
        phone: string,
        start_date: string,
        expiration_date: string
        client_login: string
    }
    
    type User = null | Manager | Client
};
