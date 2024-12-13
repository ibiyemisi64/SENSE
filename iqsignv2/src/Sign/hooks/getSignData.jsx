import { serverUrl } from "../../utils/utils.js";
import { create } from 'zustand';
import Cookies from "js-cookie"
import React, { useEffect, useState } from 'react';

/**
 * Zustand store for managing and fetching the current sign data.
 * 
 * This store defines a state that holds the current sign data (`signData`) 
 * and the loading state (`loading`). The `loadCurrentSign` function asynchronously 
 * fetches the sign data from the backend API (`/rest/signs`), and upon success, 
 * it updates the state with the fetched sign data.
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
                console.log("current signData\n" + JSON.stringify(signData?.data[0], null, 2));

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
export default getCurrentSignData;
