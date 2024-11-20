import crypto from 'crypto';

// Replace Buffer with a browser-compatible alternative
export const hasher = (msg) => {
    const bytes = new TextEncoder().encode(msg); // Encode as UTF-8
    const hash = crypto.createHash('sha512').update(bytes).digest(); // SHA-512 hash
    return hash.toString('base64'); // Convert to Base64
};


