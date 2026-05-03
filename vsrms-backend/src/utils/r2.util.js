'use strict';

const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { r2Client, R2_BUCKET, R2_PUBLIC_URL } = require('../config/r2');

/**

 *
 * @param {object} options
 * @param {Buffer} options.buffer      - Raw file bytes 
 * @param {string} options.mimeType    - MIME type
 * @param {string} options.key         - Storage path inside the bucket
 *                                      
 * @returns {Promise<string>}           - The full public URL of the uploaded file
 *
 * @example
 *   const url = await uploadToR2({
 *     buffer:   req.file.buffer,
 *     mimeType: req.file.mimetype,
 *     key:      `vehicles/${vehicleId}/${Date.now()}-${req.file.originalname}`,
 *   });
 *   // url → "https://..r2..cloudflarestorage.com/vehicles/abc/1234-photo.jpg"
 */
async function uploadToR2({ buffer, mimeType, key }) {

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: mimeType,
  });



  await r2Client.send(command);

  return `${R2_PUBLIC_URL}/${key}`;
}

/**
 * Deletes an object from Cloudflare R2
 * @param {string} key - Storage path inside the bucket
 */
async function deleteFromR2(key) {
  const command = new DeleteObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
  });
  await r2Client.send(command);
}

module.exports = { uploadToR2, deleteFromR2 };
