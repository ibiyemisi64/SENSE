import { create } from 'zustand';
import {serverUrl} from "../../utils/utils.js";
import classImg from "../../assets/backgrounds/class.png"
import oooImg from "../../assets/backgrounds/ooo-tomorrow.png"
import fallImg from "../../assets/backgrounds/fall-background.png"


export const useGalleryStore = create((set) => ({
    images: [
    ],
    addImage: (newImage) =>
        set((state) => ({ images: [...state.images, newImage] })),
    loadMockImages: () => {
        set({images: [classImg, fallImg, oooImg]})
    },
    loadImages: async () => {
        const url = new URL(`${serverUrl}/rest/signs`); // Replace with actual base URL
        url.searchParams.append("session", sessionStorage.getItem('session'));

        const resp = await fetch(url);
        const js = await resp.json();
        const rslt = [];
        const randKey = Math.random();

        if (js['status'] === 'OK') {
            const jsd = js['data'];
            for (const sd1 of jsd) {
                const namekey = sd1['namekey'];
                rslt.push(namekey);
            }
        }

        const signUrls = rslt.map((x) => `${serverUrl}/signimage/image${x}.png?y=${randKey}`);

        set({ images: signUrls });
    }
}));
