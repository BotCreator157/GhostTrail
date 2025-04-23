// src/bot/middlewares/session.js
/**
 * Simple in‑memory session store keyed by Telegram user ID.
 * Export a factory that returns the middleware.
 */
module.exports.session = () => {
    const store = new Map();
    return async (ctx, next) => {
      const userId = ctx.from?.id;
      if (userId) {
        if (!store.has(userId)) store.set(userId, {});
        ctx.session = store.get(userId);
      } else {
        ctx.session = {};
      }
      await next();
    };
  };
  