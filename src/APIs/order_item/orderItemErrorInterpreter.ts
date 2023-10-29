export default function (err: unknown) {
    if (typeof err === 'object' && err !== null) {
        if ('sqlMessage' in err) {
            if (err.sqlMessage === 'Check constraint \'valid_status\' is violated.') {
                return 'Некорректный статус заказа';
            }
        }
        if ('code' in err && err.code === 'ER_NO_REFERENCED_ROW_2') 
            return 'Некорректный id заказа';
    }
}
