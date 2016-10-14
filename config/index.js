var path = require('path')
module.exports = {

  bot: {
    key: 'YOUR_TELEGRAM_BOT_TOKEN',
    polling: true
  },

  dir: {
    root: path.resolve(__dirname, '../../')
  },
};