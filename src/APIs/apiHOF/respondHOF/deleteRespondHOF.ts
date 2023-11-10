import { Request } from 'express';

export default function deleteRespondHOF(
    del: (obj: any) => Promise<boolean | string> | string,
    userValidator: (req: Request) => Promise<boolean>
): (req: Request, res: any) => void {
    return (req, res) => {
        const body = req.params;
        if (Object.keys(body).length == 0) {
            res.status(400).send('Не указан id');
            return;
        }
        
        userValidator(req).then(ans => {
            if (!ans) {
                res.status(403).send('');
                throw 'Unauthorized';
            }
        }).then(() => {
            const delAttempt = del(body);
            if (typeof delAttempt === 'string') {
                res.status(400).send(delAttempt);
            } else {
                delAttempt
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
        }).catch(e => {
            if (e !== 'Unauthorized') console.log(e);
        });
    };
}
