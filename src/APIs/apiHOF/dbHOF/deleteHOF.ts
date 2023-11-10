// В getPut НЕ ДОЛЖНО быть колонки idColumnName среди columns

export default function getDelete<DataType extends Record<string, any>>(
    tableName: string,
    idColumnName: string,
    errorInterpreter?: (err: { code: string}) => string | void
) {
    type deleteFunction = (deletedObject: Record<string, any> | DataType) 
                      => Promise<boolean | string> | string;

    const del: deleteFunction = deletedObject => {
        if (!(idColumnName in deletedObject))
            return `Передан невалидный JSON-объект: нет поля ${idColumnName}`;

        const sql = `DELETE FROM ${tableName}
        WHERE ${idColumnName} = ?`;
        const query = global.mysqlconn.format(sql, [deletedObject[idColumnName]]);

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

    return del;
}
