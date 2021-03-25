import { request } from './api';

export const Players = {
    getAllPlayers: async () => {
        const res = await request('get', '/player/getAllPlayers');
        return res?.data;
    }
}