

import sjcl from 'sjcl';

export const hasher = (msg) => {

    let bits = sjcl.hash.sha512.hash(msg);
    let str = sjcl.codec.base64.fromBits(bits);
    return str;
};

/***
export const hasher = async (msg) => {
    console.log("Hasher input:", msg);
    const encoder = new TextEncoder();
    const data = encoder.encode(msg); // Convert string to UTF-8 bytes
    console.log("encoded data: ", data)
    const hashBuffer = await crypto.subtle.digest('SHA-512', data); // Generate SHA-512 hash
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // Convert buffer to byte array
    const hashBase64 = btoa(String.fromCharCode(...hashArray)); // Convert byte array to Base64
    return hashBase64;
};
//symlink that file into the same directory
***/
/***

import crypto from 'crypto';

// Replace Buffer with a browser-compatible alternative
export const hasher = (msg) => {
    const bytes = new TextEncoder().encode(msg); // Encode as UTF-8
    const hash = crypto.createHash('sha512').update(bytes).digest(); // SHA-512 hash
    return hash.toString('base64'); // Convert to Base64
};

// Define the hasher function
function hasher(msg) {
    let bits = sjcl.hash.sha512.hash(msg);
    let str = sjcl.codec.base64.fromBits(bits);
    return str;
}

// Example usage
let hashedValue = hasher("Hello, World!");
console.log("Hashed value:", hashedValue);
***/