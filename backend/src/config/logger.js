const pino = require('pino');
const config = require('./index');

const logger = pino({
  level: config.log.level,
  transport: config.env === 'development' ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss Z',
      ignore: 'pid,hostname',
    },
  } : undefined,
});

module.exports = logger;
