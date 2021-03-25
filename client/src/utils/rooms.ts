import { request } from './api';

type EnterOrLeaveRoom = {
    playerId: string | null,
    roomName: string | null
}

export const Rooms = {
    getAllRooms: async () => {
        const res = await request('get', '/room/getAllRooms');
        return res?.data;
    },
    enterRoom: async (body: EnterOrLeaveRoom) => {
        const res = await request('post', '/room/enterRoom', body);
        return res?.data;
    },
    leaveRoom: async (body: EnterOrLeaveRoom) => {
        const res = await request('post', '/room/leaveRoom', body);
        return res?.data;
    },
    getRoomById: async (id: string | null | undefined) => {
        const res = await request('get', `/room/getRoomById/${id}`);
        return res?.data;
    }
}