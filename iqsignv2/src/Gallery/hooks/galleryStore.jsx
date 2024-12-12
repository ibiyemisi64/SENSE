import { create } from 'zustand';
import {serverUrl} from "../../utils/utils.js";
import classImg from "../../assets/backgrounds/class.png"
import oooImg from "../../assets/backgrounds/ooo-tomorrow.png"
import fallImg from "../../assets/backgrounds/fall-background.png"
import Cookies from "js-cookie"


export const useGalleryStore = create((set) => ({
    images: [
    ],
    names: [],
    filter:"",
    setFilter: (s) => set({filter:s}),
    addImage: (newImage) =>
        set((state) => ({ images: [...state.images, newImage] })),
    loadMockImages: () => {
        set({images: [classImg, fallImg, oooImg], names:["class","fall", "Out Of Office"]})
    },
    loadImages: async () => {
        const url = new URL(`${serverUrl}/rest/signs`); // Replace with actual base URL
        url.searchParams.append("session", Cookies.get('session'));

        const resp = await fetch(url);
        const js = await resp.json();
        const rslt = [];
        const randKey = Math.random();
        const names = [];

        if (js['status'] === 'OK') {
            const jsd = js['data'];
            console.log(jsd)
            for (const sd1 of jsd) {
                const namekey = sd1['namekey'];
                rslt.push(namekey);
                names.push(sd1['displayname'])
            }
        }

        const signUrls = rslt.map((x) => `${serverUrl}/signimage/image${x}.png?y=${randKey}`);

        set({ images: signUrls, names:names });
    },
    namedSignMock: async ()=>{
        const url = new URL(`${serverUrl}/rest/namedsigns`); // Replace with actual base URL
        url.searchParams.append("session", Cookies.get('session'));
        const data = await fetch(url);
        const jsonData = await data.json()
        const obj = jsonData[0];
    }
}));
