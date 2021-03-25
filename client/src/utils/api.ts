import axios from 'axios';

type Method = 'get' | 'post';

export const request = async (method: Method, url: string, body: object = {}) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
        }
    }

    if (method === 'get') {
        try {
            const res = await axios.get(url);
            return res;
        } catch (error) {
            console.error(error);
            return;
        }
    }

    if (method === 'post') {
        try {
            const res = await axios.post(url, body, config);
            return res;
        } catch (error) {
            console.error(error);
            return;
        }
    }
}