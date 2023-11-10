import { Express } from 'express';
import addLoginClientAPI from './loginClient';
import addLoginManagerAPI from './loginManager';
import addLogoutAPI from './logout';

export default function addAuthAPI(app: Express) {
    addLoginClientAPI(app);
    addLoginManagerAPI(app);
    addLogoutAPI(app);
}
