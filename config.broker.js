const configName = process.env.configName || 'config'

const config = require(`./${configName}`);

module.exports = config;