const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { sendSuccess } = require('../utils/apiResponse');

router.get('/', (_req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  return sendSuccess(res, {
    status: 'ok',
    database: dbStatus,
    uptime: Math.floor(process.uptime()),
    memory: process.memoryUsage(),
    env: process.env.NODE_ENV || 'development',
    version: '1.0.0',
  }, 'Service is healthy.');
});

module.exports = router;
