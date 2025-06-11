// lib/crypto.js
import crypto from 'crypto';

// Function to generate a random salt
export function generateSalt(length = 32) {
  return crypto.randomBytes(length); // Returns Buffer
}

// Function to generate a random initialization vector (IV)
export function generateIv(length = 16) {
  return crypto.randomBytes(length); // Returns Buffer
}

// Derive key from password + salt using PBKDF2
// Salt should be a Buffer or string (will be converted to Buffer internally by pbkdf2Sync)
// Returns the derived key as a Buffer
export function generateKey(password, salt, iterations = 100000, keyLen = 32) {
  // Consider making iterations configurable via environment variable for security tuning
  // Storing the key as hex is common for transport/storage if needed, but keep it as Buffer for direct use
  return crypto.pbkdf2Sync(password, salt, iterations, keyLen, 'sha256');
}

// Function to encrypt data using AES-256-CBC
// Expects key and iv as Buffers
export function encrypt(data, key, iv) {
  try {
    // Ensure key and iv are Buffers
    if (!Buffer.isBuffer(key)) throw new Error('Encryption key must be a Buffer.');
    if (!Buffer.isBuffer(iv)) throw new Error('Encryption IV must be a Buffer.');
    if (iv.length !== 16) throw new Error('Invalid IV length for AES-256-CBC.');

    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(data, 'utf8'); // Specify input encoding
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('base64'); // Base64 is good for transport/storage
  } catch (error) {
    console.error("Encryption failed:", error);
    // Don't expose internal crypto errors directly to client if this runs server-side
    // Throwing a generic error is okay for client-side usage or internal server errors
    throw new Error("Encryption failed");
  }
}

// Function to decrypt data using AES-256-CBC
// Expects key and iv as Buffers, encryptedData as Base64 string
export function decrypt(encryptedData, key, iv) {
  try {
    // Ensure key and iv are Buffers
    if (!Buffer.isBuffer(key)) throw new Error('Decryption key must be a Buffer.');
    if (!Buffer.isBuffer(iv)) throw new Error('Decryption IV must be a Buffer.');
    if (iv.length !== 16) throw new Error('Invalid IV length for AES-256-CBC.');

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    const encryptedText = Buffer.from(encryptedData, 'base64'); // Convert Base64 string to Buffer
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString('utf8'); // Specify output encoding
  } catch (error) {
    // Common error: Authentication failed (wrong key/iv or corrupted data)
    if (error.message.includes('bad decrypt')) {
       console.error("Decryption failed: Authentication tag mismatch (likely wrong password/key or corrupted data).");
       throw new Error("Decryption failed: Invalid password or corrupted data.");
    }
    console.error("Decryption failed:", error);
    throw new Error("Decryption failed");
  }
}