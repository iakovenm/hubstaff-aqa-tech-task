/**
 * Logger utility for structured logging
 */
class Logger {
    constructor(debug = false) {
      this.debug = debug;
    }
  
    info(...messages) {
      console.log('[INFO]', ...messages);
    }
  
    debugLog(...messages) {
      if (this.debug) {
        console.log('[DEBUG]', ...messages);
      }
    }
  
    error(...messages) {
      console.error('[ERROR]', ...messages);
    }
  }

  module.exports = Logger;