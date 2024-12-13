import { create } from 'zustand';
import {serverUrl} from "../../utils/utils.js";
import classImg from "../../assets/backgrounds/class.png"
import oooImg from "../../assets/backgrounds/ooo-tomorrow.png"
import fallImg from "../../assets/backgrounds/fall-background.png"
import Cookies from "js-cookie"
/*
 *      galleryStore.jsx
 *
 *    handle all fetching logic, while providing a zustand store for other components,
 *    mostly used in the gallery components
 *
 */
/*	Copyright 2024 Brown University -- Jason S Silva.	*/
/// *******************************************************************************
///  Copyright 2024, Brown University, Providence, RI.				 *
///										 *
///			  All Rights Reserved					 *
///										 *
///  Permission to use, copy, modify, and distribute this software and its	 *
///  documentation for any purpose other than its incorporation into a		 *
///  commercial product is hereby granted without fee, provided that the 	 *
///  above copyright notice appear in all copies and that both that		 *
///  copyright notice and this permission notice appear in supporting		 *
///  documentation, and that the name of Brown University not be used in 	 *
///  advertising or publicity pertaining to distribution of the software 	 *
///  without specific, written prior permission. 				 *
///										 *
///  BROWN UNIVERSITY DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS		 *
///  SOFTWARE, INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND		 *
///  FITNESS FOR ANY PARTICULAR PURPOSE.  IN NO EVENT SHALL BROWN UNIVERSITY	 *
///  BE LIABLE FOR ANY SPECIAL, INDIRECT OR CONSEQUENTIAL DAMAGES OR ANY 	 *
///  DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS,		 *
///  WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS		 *
///  ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE 	 *
///  OF THIS SOFTWARE.								 *
///										 *
///******************************************************************************


export const useGalleryStore = create((set) => ({
    images: [
    ],
    names: [],
    signId:0,
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
    loadImagesNew: async () => {
        const url = new URL(`${serverUrl}/rest/signs`); // Replace with actual base URL
        url.searchParams.append("session", Cookies.get('session'));

        const resp = await fetch(url);
        const js = await resp.json();
        const rslt = [];
        const randKey = Math.random();
        const names = [];
        let signId = -1;
        let user = -1;
        if (js['status'] === 'OK') {
            const jsd = js['data'];
            console.log(jsd)
            const sd1 = jsd[0];
            signId = sd1['signid']
            user = sd1['userid']

        }
        if (user === 0 || signId ===-1){
            throw new Error("CAN NOT CONNECT TO SERVER")
        }
        const newUrl = new URL(`${serverUrl}/rest/namedsigns`); // Replace with actual base URL
        newUrl.searchParams.append("session", Cookies.get('session'));
        const jsonData = await (await fetch(url)).json()
        const allSigns = jsonData.data
        for (const sign of allSigns) {
            const loadSign = new URL(`${serverUrl}/rest/loadsignimage`);
            loadSign.searchParams.append("session", Cookies.get('session'));
            const loadSignPostBody = {
                name:sign['name']
            }
            const loadResp = await fetch(loadSign, {
                method:"POST",
                body:JSON.stringify(loadSignPostBody),
            })
            const loadData = await loadResp.json()

            const previewUrl = new URL(`${serverUrl}/rest/sign/preview`);
            newUrl.searchParams.append("session", Cookies.get('session'));
            const postBody = {
                signdata:sign['content'],
                signuser:user,
                signid:signId,

            }
            const resp = await fetch(previewUrl,{
                method:'POST',
                body:JSON.stringify(postBody)
                });
            const previewData = await resp.json();



        }


        set({ signId:signId });
    },
    namedSignMock: async ()=>{
        const url = new URL(`${serverUrl}/rest/namedsigns`); // Replace with actual base URL
        url.searchParams.append("session", Cookies.get('session'));
        const data = await fetch(url);
        const jsonData = await data.json()
    }
}));
