export default function (err: unknown) {
    if (typeof err === 'object' && err !== null) {
        if ('sqlMessage' in err) {
            if (err.sqlMessage === 'Check constraint \'password_long_enough\' is violated.') {
                return 'Не выполняются требования для пароля';
            }
            if (err.sqlMessage === 'Check constraint \'name_latin_or_russian\' is violated.') {
                return 'Некорректное имя';
            }
            
        }
        if ('code' in err && err.code === 'ER_DUP_ENTRY') 
            return 'Такой логин уже есть!'; 
    }
}
