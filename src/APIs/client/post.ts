type correctProps = {
    login: string,
    password: string,
    name: string,
    address: string,
    phone: string
}

export default function postClient(client: Record<string, any> | correctProps): 
    Promise<boolean | string> | string {

    if (!('name' in client) || !('login' in client) || !('password' in client)
        || !('address' in client) || !('phone' in client)) {
        return 'Передан невалидный JSON-объект';
    }

    const sql = 'INSERT client(login, password, name, address, phone) VALUES(?, ?, ?, ?, ?)';
    const query = global.mysqlconn.format(
        sql, 
        [client.login, client.password, client.name, client.address, client.phone]
    );
    return new Promise((resolve, reject) => {
        global.mysqlconn.query(query, err => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') reject('Такой логин уже есть!');
                reject(err);
            }
            resolve(true);
        });
    });
}
