// eslint-disable-next-line no-undef
export default function postCookie(user: User) {
    if (!user)
        return;
    const sql = `
    INSERT INTO session(user_type, cookie, manager_login, client_login, start_date, expiration_date)
    VALUES (
        '${user.user_type}',
        '${user.cookie}',
         ${user.user_type === 'manager' ? `'${user.login}'` : 'NULL'},
         ${user.user_type === 'client' ? `'${user.login}'` : 'NULL'},
         '${new Date(Date.now()).toISOString().slice(0, 19).replace('T', ' ')}',
         '${new Date(Date.now() + 1000 * 60 * 60).toISOString().slice(0, 19).replace('T', ' ')}')`;

    global.mysqlconn.query(sql, err => {
        if (err) throw err;
    });
}
