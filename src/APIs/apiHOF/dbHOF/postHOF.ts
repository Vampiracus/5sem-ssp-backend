export default function getPost<DataType extends Record<string, any>>(
    tableName: string,
    columns: string[],
    dataValidator?: (obj: DataType, isPost?: boolean) => string | boolean,
    errorInterpreter?: (err: { code: string}) => string | void
) {
    type postFunction = (postedObject: Record<string, any> | DataType) 
                      => Promise<boolean | string> | string;

    const post: postFunction = postedObject => {
        for(const column of columns) {
            if (!(column in postedObject)) {
                return `Передан невалидный JSON-объект: нет поля ${column}`;
            }
        }

        if (dataValidator) {
            const validated = dataValidator(postedObject as DataType, true);
            if (typeof validated === 'string')
                return validated;
        }

        const sql = `INSERT ${tableName}(${columns.reduce((prev, cur) => prev + ', ' + cur)})`
                  + `VALUES(${(columns.map(() => '?')).reduce((prev, cur) => prev + ', ' + cur)})`;
        const query = global.mysqlconn.format(
            sql,
            columns.map(column => (postedObject[column] === 'NULL' ? null : postedObject[column]))
        );

        return new Promise((resolve, reject) => {
            global.mysqlconn.query(query, err => {
                if (err) {
                    if (errorInterpreter) {
                        const interpreted = errorInterpreter(err);
                        if (typeof interpreted === 'string')
                            reject(interpreted);
                    }
                    reject(err);
                }
                resolve(true);
            });
        });
    };
    return post;
}
