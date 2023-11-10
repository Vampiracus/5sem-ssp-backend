import { Request } from 'express';

export default function getRespongHOF<DataType extends Record<string, any>>(
    get: () => Promise<DataType[]>,
    userValidator: (req: Request) => Promise<boolean>
): (req: any, res: any) => void {
    return (req, res) => {
        userValidator(req).then(ans => {
            if (!ans) {
                res.status(403).send('');
                throw 'Unauthorized';
            }
        }).then(() => {
            const getAttempt = get();
            getAttempt
                .then(objs => {
                    res.status(200).send(objs);
                })
                .catch(err => {
                    res.status(500).send('Не получилось получить данные из базы данных');
                    console.log(err);
                });
        }).catch(e => {
            if (e !== 'Unauthorized') console.log(e);
        });
    };
}
