import { request } from './api';

type CreatePlayer = {
    name: string
};

export const Players = {
    getAllPlayers: async () => {
        const res = await request('get', '/player/getAllPlayers');
        return res?.data;
    },
    createPlayer: async (body: CreatePlayer) => {
        const res = await request('post', '/player/create', body);
        return res?.data;
    },
    getPlayerById: async (id: string | null | undefined) => {
        const res = await request('get', `/player/getPlayerById/${id}`);
        return res?.data;
    },
    addWinCount: async (playerId: string | null | undefined) => {
        const res = await request('post', `/player/addWinCount`, { playerId });
        return res?.data;
    }
}