'use strict';

/**
 * Mongoose plugin to standardize JSON output.
 * - Converts _id (ObjectId) to a string.
 * - Removes __v (version key).
 * - Removes sensitive fields like password (if they existed).
 */
module.exports = function jsonFormatter(schema) {
  const transform = (doc, ret, options) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    return ret;
  };

  schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform,
  });

  schema.set('toObject', {
    virtuals: true,
    versionKey: false,
    transform,
  });
};
