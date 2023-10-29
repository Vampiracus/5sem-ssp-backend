export default function getGet<DataType extends Record<string, any>>(
    tableName: string,
    columns: string[]
) {
    const get: () => Promise<DataType[]> = () => {
        const sql = `SELECT ${columns.reduce((prev, cur) => prev + ', ' + cur)} from ${tableName}`;
        const query = sql;

        return new Promise((resolve, reject) => {
            global.mysqlconn.query(query, (err, resp) => {
                if (err) {
                    reject(err);
                }
                resolve(resp);
            });
        });
    };

    return get;
}
