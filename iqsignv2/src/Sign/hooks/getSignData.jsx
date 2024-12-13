import { serverUrl } from "../../utils/utils.js";
import { create } from 'zustand';
import Cookies from "js-cookie"

// Get current sign data. 
// * \ * / * \ *
// Returns signData object with keys: dim, displayname, height,  
// imageurl, interval, localimageurl, name, namekey, signbody, 
// signid, signurl, signuser, width.
export const getCurrentSignData = create((set) => ({
    signData: {},
    loadCurrentSign: async () => {
        const path = "/rest/signs"
        const url = new URL(`${serverUrl}${path}`);
        url.searchParams.append("session", Cookies.get('session'));

        try {
            const resp = await fetch(url);

            if (resp.status === 200) {
                const signData = await resp.json();
                console.log("current signData\n" + JSON.stringify(signData?.data[0], null, 2));
                set({ signData: signData?.data[0] });
            } else {
                console.error(`backend API call /rest/signs failed with status: ${resp.status}`);
            }
        } catch (error) {
            console.error("Failed to fetch data /rest/signs:", error);
        }
    },
}));

export default getCurrentSignData;
