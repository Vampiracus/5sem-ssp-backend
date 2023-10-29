export default function getRespongHOF<DataType extends Record<string, any>>
(get: () => Promise<DataType[]>): (req: any, res: any) => void {
    
    return (_, res) => {
        const getAttempt = get();
        getAttempt
            .then(objs => {
                res.status(200).send(objs);
            })
            .catch(err => {
                res.status(500).send('Не получилось получить данные из базы данных');
                console.log(err);
            });
    };
}
