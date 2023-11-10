import { Express, Request } from 'express';
import getPost from './dbHOF/postHOF';
import getPut from './dbHOF/putHOF';
import getGet from './dbHOF/getHOF';
import getRespondHOF from './respondHOF/getRespondHOF';
import postRespondHOF from './respondHOF/postRespondHOF';
import putRespondHOF from './respondHOF/putRespondHOF';

type UserValidator = {
    get: (req: Request) => Promise<boolean>,
    post: (req: Request) => Promise<boolean>,
    put: (req: Request) => Promise<boolean>
}

// НЕ ДОЛЖНО быть колонки idColumnName среди columns
export default function apiHOF<DataType extends Record<string, any>>(
    app: Express,
    tableName: string,
    idColumnName: string,
    columns: string[],
    url: string,
    userValidator: UserValidator,
    dataValidator?: (data: DataType, isPost?: boolean, req?: Request) => string | boolean,
    errInterpreter?: (err: { code: string}) => string | void
) {
    const post = getPost(tableName, columns.concat([idColumnName]), dataValidator, errInterpreter);
    app.post(url, postRespondHOF(post, userValidator.post));

    const put = getPut(tableName, idColumnName, columns, dataValidator, errInterpreter);
    app.put(url, putRespondHOF(put, userValidator.put));

    const get = getGet(tableName, columns.concat([idColumnName]));
    app.get(url, getRespondHOF(get, userValidator.get));
}
