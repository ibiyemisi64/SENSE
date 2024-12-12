import {serverUrl} from "../../utils/utils.js";
import { create } from 'zustand';
import Cookies from "js-cookie"

export const getCurrentSignData = create((set) => ({
    signData: {},
    signImageUrl: "",
    signPreviewUrl: "",
    loadCurrentSign: async () => {
        const url = new URL(`${serverUrl}/rest/signs`);
        url.searchParams.append("session", Cookies.get('session'));
        const resp = await fetch(url);
        const signData = await resp.json(); 
        console.log("current sign data");
        console.log(signData);
        set({signData : signData, signImageUrl :  signData.data[0].imageurl, signPreviewUrl :  signData.data[0].signurl});
    }
    
}));

export default getCurrentSignData;
