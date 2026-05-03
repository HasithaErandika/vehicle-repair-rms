'use strict';

/**
 * Standardised pagination parser for query parameters.
 * Enforces sane defaults and a maximum page size of 100.
 *
 * @param {object} query - Express `req.query` object.
 * @returns {{ page: number, limit: number, skip: number }}
 */
const paginate = (query) => {
  const page  = Math.max(1, parseInt(query.page)  || 1);
  const limit = Math.min(100, parseInt(query.limit) || 20);
  const skip  = (page - 1) * limit;
  return { page, limit, skip };
};

module.exports = { paginate };
