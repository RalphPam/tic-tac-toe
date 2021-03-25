import { request } from './api';

export const Rooms = {
    getAllRooms: async () => {
        const res = await request('get', '/room/getAllRooms');
        return res?.data;
    }
}