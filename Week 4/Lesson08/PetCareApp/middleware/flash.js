function flash() {
  return function flashMiddleware(req, res, next) {
    req.flash = function flashMessage(type, message) {
      const messages = req.session.flash || (req.session.flash = {});

      if (arguments.length === 0) {
        req.session.flash = {};
        return messages;
      }

      if (arguments.length === 1) {
        const queuedMessages = messages[type] || [];
        delete messages[type];
        return queuedMessages;
      }

      const values = Array.isArray(message) ? message : [message];
      messages[type] = (messages[type] || []).concat(values);
      return messages[type].length;
    };

    next();
  };
}

module.exports = flash;
