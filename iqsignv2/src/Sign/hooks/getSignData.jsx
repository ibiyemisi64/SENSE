/***
 * getSignData.jsx
 *
 * Purpose: react hooks to interact with Professor Reiss iqsign rest server. 
 *
 *
 * Copyright 2024 Brown University -- Ibiyemisi Gbenebor
 *
 * All Rights Reserved
 *
 * Permission to use, copy, modify, and distribute this software and its
 * documentation for any purpose other than its incorporation into a
 * commercial product is hereby granted without fee, provided that the
 * above copyright notice appear in all copies and that both that
 * copyright notice and this permission notice appear in supporting
 * documentation, and that the name of Brown University not be used in
 * advertising or publicity pertaining to distribution of the software
 * without specific, written prior permission.
 *
 * BROWN UNIVERSITY DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS
 * SOFTWARE, INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
 * FITNESS FOR ANY PARTICULAR PURPOSE. IN NO EVENT SHALL BROWN UNIVERSITY
 * BE LIABLE FOR ANY SPECIAL, INDIRECT OR CONSEQUENTIAL DAMAGES OR ANY
 * DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS,
 * WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS
 * ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE
 * OF THIS SOFTWARE.
 ***/

import { serverUrl } from "../../utils/utils.js";
import { create } from 'zustand';
import Cookies from "js-cookie"
import { useEffect, useState } from 'react';

/**
 * Zustand store for managing and fetching the current sign data.
 *
 * The `signData` object includes the following keys:
 * - dim: The dimensions of the sign (e.g., width and height).
 * - displayname: The display name of the sign.
 * - height: The height of the sign.
 * - imageurl: The URL of the sign's image.
 * - interval: The time interval for the sign.
 * - localimageurl: The local path to the image.
 * - name: The name of the sign.
 * - namekey: The key associated with the name of the sign.
 * - signbody: The body/content text of the sign.
 * - signid: The unique identifier of the sign.
 * - signurl: The URL for the sign.
 * - signuser: The user associated with the sign.
 * - width: The width of the sign.
 * 
 * Usage:
 * - Use `getCurrentSignData` to access and update the current sign data 
 *   and monitor the loading state.
 * - The `loadCurrentSign` function can be called to trigger fetching the sign data.
 * 
 * Example:
 * const { signData, loading, loadCurrentSign } = getCurrentSignData();
 */

export const getCurrentSignData = create((set) => ({
    signData: {},
    loading: true,
    loadCurrentSign: async () => {
        const path = "/rest/signs"
        const url = new URL(`${serverUrl}${path}`);
        url.searchParams.append("session", Cookies.get('session'));

        try {
            const resp = await fetch(url);

            if (resp.status === 200) {
                const signData = await resp.json();
                if (signData?.data && signData.data[0]) {
                    set({ signData: signData.data[0], loading: false });
                }
            } else {
                console.error(`backend API call /rest/signs failed with status: ${resp.status}`);
                set({ loading: false });
            }

        } catch (error) {
            console.error("Failed to fetch data /rest/signs:", error);
            set({ loading: false });
        }
    },
}));

/**
 * Custom hook for fetching and managing sign data.
 * 
 * This hook encapsulates the logic for fetching sign data from an API using 
 * the `loadCurrentSign` function from the store. It manages the loading state 
 * internally and returns the fetched sign data (`signData`) and a boolean 
 * flag (`isLoading`) that indicates whether the data is still being fetched.
 * 
 * Usage:
 * - Call this hook in your components to automatically fetch sign data 
 *   and handle loading state.
 * - Returns `signData` and `isLoading`.
 * 
 * Example:
 * const { signData, isLoading } = useSignData();
 */
export const useSignData = () => {
    const { signData, loadCurrentSign, loading } = getCurrentSignData();

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            await loadCurrentSign();
            setIsLoading(false);
        };

        fetchData();
    }, [loadCurrentSign]);

    return { signData, isLoading };
};

/**
 * Custom hook for updating sign data.
 * 
 * This hook encapsulates the logic for updating sign data in the backend 
 * using the `/rest/sign/update` API endpoint. It takes in the `signData` 
 * to be updated and manages the loading state internally.
 * 
 * Usage:
 * - Call this hook in your components to initiate the sign update process.
 * - The hook will set the loading state to `true` while the update is in progress.
 * - Returns `void` once the sign update is complete or if an error occurs.
 * 
 * Example:
 * const { signData, setLoading } = useUpdateSign({ signData, loading, setLoading });
 * 
 * @param {Object} params - The parameters for updating the sign.
 * @param {Object} params.signData - The sign data to be updated (includes dimensions, name, etc.).
 * @param {boolean} params.loading - A state variable indicating whether the update operation is in progress.
 * @param {Function} params.setLoading - A function to update the loading state.
 * 
 * @returns {Promise<void>} Resolves with no value when the sign update is complete.
 * 
 * @throws {Error} If the sign data is not provided or if the API call fails.
 */

export const useUpdateSign = async ({ signData, loading, setLoading }) => {
    if (!signData) {
        console.error('Sign data not available');
        return;
    }

    console.log('Starting sign update...');
    setLoading(true);

    const {
        dim,
        height,
        name,
        namekey,
        signbody,
        signid,
        signuser,
        width
    } = signData;

    const updateData = {
        signid,
        name,
        signuser,
        signkey: namekey,
        signbody,
        signname: name,
        signwidth: width,
        signheight: height,
        signdim: dim
    };

    try {
        const path = "/rest/sign/update"
        const url = new URL(`${serverUrl}${path}`);
        url.searchParams.append("session", Cookies.get('session'));
        const resp = await fetch(url.toString(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
        });

        if (resp.status != 200) {
            console.error(`backend API call /rest/sign/update failed with status: ${resp.status}`);
            setLoading(false);
        }
    } catch (error) {
        console.log("Error fetching /rest/sign/update.");
        setLoading(false);
        return
    }
    console.log('Finished updating sign!');
    return
};

export default getCurrentSignData;
