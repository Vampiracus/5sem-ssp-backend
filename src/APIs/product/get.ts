type correctProps = {
    name: string,
    cost: number,
}

export default function getProducts(): Promise<correctProps[]> {
    const sql = 'SELECT * FROM product';
    return new Promise((resolve, reject) => {
        global.mysqlconn.query(sql, (err, resp) => {
            if (err) {
                reject(err);
            }
            resolve(resp);
        });
    });
}
