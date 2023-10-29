export default function putRespondHOF(put: (obj: any) => Promise<boolean | string> | string):
(req: any, res: any) => void {
    return (req, res) => {
        const body = req.body;
        if (Object.keys(body).length == 0) {
            res.status(400).send('Послан не JSON-объект');
            return;
        }
        
        const putAttempt = put(body);
        if (typeof putAttempt === 'string') {
            res.status(400).send(putAttempt);
        } else {
            putAttempt
                .then(() => {
                    res.status(200).send('OK');
                })
                .catch((err: any) => {
                    if (typeof err === 'string') {
                        res.status(400).send(err);
                        return;
                    }
                    res.status(400).send('Не получилось внести изменения в базу данных');
                    console.log(err);
                });
        }
    };
}
