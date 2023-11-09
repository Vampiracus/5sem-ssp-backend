import { Express } from 'express';
import addLoginClientAPI from './login/loginClient';

export default function addAuthAPI(app: Express) {
    addLoginClientAPI(app);
}
