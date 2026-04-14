'use strict';

const rateLimit = require('express-rate-limit');

const isDev = process.env.NODE_ENV !== 'production';

const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  // In development, allow 1000 req/window so hot-reload loops never trip the limiter.
  // In production this falls back to RATE_LIMIT_MAX env var (default 100).
  max: isDev ? 1000 : (parseInt(process.env.RATE_LIMIT_MAX) || 100),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests — please try again later' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 200 : 20,
  message: { error: 'Too many auth requests — please wait 15 minutes' },
});

module.exports = { apiLimiter, authLimiter };
