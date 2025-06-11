// lib/vault-crypto.js
import { encrypt, decrypt, generateSalt, generateIv, generateKey } from './crypto';

// Encrypts a single data structure + returns base64 salt & iv
export async function vaultEncrypt(vaultPassword, dataToEncrypt) {
  // dataToEncrypt should be an object like { username, password, website, notes }
  const salt = generateSalt(); // Generate a unique salt for this item (Buffer)
  const iv = generateIv();     // Generate a unique IV for this encryption (Buffer)

  // Derive the key from the user's vault password and the unique salt
  // Pass salt as Buffer directly
  const key = generateKey(vaultPassword, salt); // Returns Buffer

  // Combine data into a single string (JSON is convenient)
  const plaintext = JSON.stringify(dataToEncrypt);

  // Encrypt the combined data
  const encryptedData = encrypt(plaintext, key, iv); // Pass Buffers

  return {
    encryptedData: encryptedData, // Single encrypted blob (Base64)
    salt: salt.toString('base64'), // Store salt as Base64 string
    iv: iv.toString('base64'),     // Store IV as Base64 string
  };
}

// Decrypts using vaultPassword + base64-encoded salt & iv
export async function vaultDecrypt(vaultPassword, { encryptedData, salt, iv }) {
  const decodedSalt = Buffer.from(salt, 'base64'); // Decode salt from Base64 to Buffer
  const decodedIv = Buffer.from(iv, 'base64');     // Decode IV from Base64 to Buffer

  // Regenerate the key using the password and the decoded salt
  const key = generateKey(vaultPassword, decodedSalt); // Returns Buffer

  // Decrypt the single blob of data
  const decryptedJson = decrypt(encryptedData, key, decodedIv); // Pass Buffers

  // Parse the JSON string back into an object
  try {
      const decryptedData = JSON.parse(decryptedJson);
      return decryptedData; // e.g., { username, password, website, notes }
  } catch (parseError) {
      console.error("Failed to parse decrypted JSON:", parseError);
      throw new Error("Decryption succeeded, but data format is invalid.");
  }
}