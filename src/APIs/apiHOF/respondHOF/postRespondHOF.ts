import { Request } from 'express';

export default function postRespondHOF(
    post: (obj: any) => Promise<boolean | string> | string,
    userValidator: (req: Request) => Promise<boolean>
): (req: any, res: any) => void {
    return (req, res) => {
        const body = req.body;
        if (Object.keys(body).length == 0) {
            res.status(400).send('Послан не JSON-объект');
            return;
        }

        userValidator(req).then(ans => {
            if (!ans) {
                res.status(403).send('');
                throw 'Unauthorized';
            }
        }).then(() => {
            const insertionAttempt = post(body);
            if (typeof insertionAttempt === 'string') {
                res.status(400).send(insertionAttempt);
            } else {
                insertionAttempt
                    .then(() => {
                        res.status(201).send('OK');
                    })
                    .catch((err: any) => {
                        if (typeof err === 'string') {
                            res.status(400).send(err);
                            return;
                        }
                        res.status(400).send('Не получилось добавить в базу данных');
                        console.log(err);
                    });
            }
        }).catch(e => {
            if (e !== 'Unauthorized') console.log(e);
        });
    };
}
