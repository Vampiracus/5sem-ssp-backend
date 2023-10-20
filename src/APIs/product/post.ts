type correctProps = {
    name: string,
    cost: number,
}

export default function postProduct(product: Record<string, any> | correctProps): 
    Promise<boolean> | string {

    if (!('name' in product) || !('cost' in product)
        || (typeof product.name !== 'string') || (typeof product.cost !== 'number')) {
        return 'Передан невалидный JSON-объект';
    }
    if (product.cost < 0) {
        return 'Цена не может быть отрицательной';
    }

    const sql = 'INSERT product(name, cost) VALUES(?, ?)';
    const query = global.mysqlconn.format(sql, [product.name, product.cost]);
    return new Promise((resolve, reject) => {
        global.mysqlconn.query(query, err => {
            if (err) {
                reject(err);
            }
            resolve(true);
        });
    });
}
