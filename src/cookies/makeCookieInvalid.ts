export default function makeCookieInvalid(cookie: string) {
    if (!cookie)
        return;
    const sql = `
    UPDATE session
    SET expiration_date = '${new Date(Date.now()).toISOString().slice(0, 19).replace('T', ' ')}'
    WHERE cookie = ?`;
    const query = global.mysqlconn.format(sql, [cookie]);
    global.mysqlconn.query(query, err => {
        if (err) throw err;
    });
}
