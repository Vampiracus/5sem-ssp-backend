type correctProps = {
    id: number,
    name: string,
    cost: number,
}

export default function putProduct(product: Record<string, any> | correctProps): 
    Promise<boolean> | string {

    if (!('name' in product) || !('cost' in product) || !('id' in product)
        || (typeof product.name !== 'string') || (typeof product.cost !== 'number')
        || (typeof product.id !== 'number')) {
        return 'Передан невалидный JSON-объект';
    }
    if (product.cost < 0) {
        return 'Цена не может быть отрицательной';
    }
    const sql = `
    UPDATE product SET cost = ?, name = ?
    WHERE id = ?
    `;
    
    const query = global.mysqlconn.format(sql, [product.cost, product.name, product.id]);

    console.log(sql);
    return new Promise((resolve, reject) => {
        global.mysqlconn.query(query, err => {
            if (err) {
                reject(err);
            }
            resolve(true);
        });
    });
}
