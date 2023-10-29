// В getPut НЕ ДОЛЖНО быть колонки idColumnName среди columns

export default function getPut<DataType extends Record<string, any>>(
    tableName: string,
    idColumnName: string,
    columns: string[],
    dataValidator?: (obj: DataType, isPost?: boolean) => string | boolean,
    errorInterpreter?: (err: { code: string}) => string | void
) {
    type putFunction = (putObject: Record<string, any> | DataType) 
                      => Promise<boolean | string> | string;

    const put: putFunction = putObject => {
        for(const column of columns) {
            if (!(column in putObject))
                return `Передан невалидный JSON-объект: нет поля ${column}`;
        }

        if (!(idColumnName in putObject))
            return `Передан невалидный JSON-объект: нет поля ${idColumnName}`;

        if (dataValidator) {
            const validated = dataValidator(putObject as DataType, false);
            if (typeof validated === 'string')
                return validated;
        }

        const sql = `UPDATE ${tableName}
        SET ${(columns.map(col => col + ' = ?')).reduce((prev, cur) => prev + ', ' + cur)}
        WHERE ${idColumnName} = ?`;
        const query = global.mysqlconn.format(
            sql,
            columns.map(column => (putObject[column] === 'NULL' ? null : putObject[column]))
                .concat([putObject[idColumnName]])
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

    return put;
}
