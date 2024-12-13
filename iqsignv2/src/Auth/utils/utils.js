
/***
 * utils.js
 *
 * Purpose:
 *
 *
 * Copyright 2024 Brown University --
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

import sjcl from 'sjcl';

export const hasher = (msg) => {

    let bits = String(sjcl.hash.sha512.hash(msg));
    console.log(typeof bits)
    let str = String(sjcl.codec.base64.fromBits(bits));
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
    return String(hashBase64);
};
//symlink that file into the same directory
***/
/***

//import crypto from 'crypto';

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