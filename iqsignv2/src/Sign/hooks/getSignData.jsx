import {serverUrl} from "../../utils/utils.js";
import { create } from 'zustand';
import Cookies from "js-cookie"

export const getSignData = create((set) => ({
    loadCurrentSign: async () => {
        const url = new URL(`${serverUrl}/rest/namedsigns`);
        url.searchParams.append("session", Cookies.get('session'));
        const resp = await fetch(url);
        const js = await resp.json();

        console.log(js);
        
    }
}));

export default getSignData;
