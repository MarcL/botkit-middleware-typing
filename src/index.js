const typingDelay = require('./typingDelay');

const typingIndicatorMessage = message => ({
    recipient: { id: message.to },
    channel: message.channel,
    sender_action: 'typing_on',
});

const botSupportsTyping = bot => bot.startTyping;

// Currently only supports Facebook response
const isTypingMessage = message =>
    message.sender_action && message.sender_action === 'typing_on';

const botkitMiddlewareTyping = (config = {}) => (bot, message, next) => {
    const { maximumTypingDelayMs, typingDelayMs } = config;

    if (botSupportsTyping(bot) && !isTypingMessage(message)) {
        const typingDelayMilliseconds =
            typingDelayMs || typingDelay(message, maximumTypingDelayMs);

        bot.send(typingIndicatorMessage(message), () => {
            setTimeout(() => next(), typingDelayMilliseconds);
        });
    } else {
        next();
    }
};

module.exports = botkitMiddlewareTyping;
