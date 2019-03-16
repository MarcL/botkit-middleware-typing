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
    if (botSupportsTyping(bot) && !isTypingMessage(message)) {
        // const typingDelay = calculateTypingDelay(message);
        bot.send(typingIndicatorMessage(message), () => {
            setTimeout(() => next(), typingDelay);
        });
    } else {
        next();
    }
};

// const config = require('../config');

// const AVERAGE_WORDS_PER_MINUTE = 85;
// const AVERAGE_CHARACTERS_PER_MINUTE = AVERAGE_WORDS_PER_MINUTE * 7;
// const DEFAULT_ATTACHMENT_TEXT_LENGTH = 80;

// const MAXIMUM_TYPING_DELAY =
//     config.get('application.maximumTypingDelaySeconds') * 1000;

// const calculateTypingDelay = response => {
//     let textLength;
//     if (typeof response === 'string') {
//         textLength = response.length;
//     } else if (response.text) {
//         textLength = response.text.length;
//     } else {
//         textLength = DEFAULT_ATTACHMENT_TEXT_LENGTH;
//     }

//     const textSpeed =
//         Math.floor(textLength / (AVERAGE_CHARACTERS_PER_MINUTE / 60)) * 1000;

//     return Math.min(textSpeed, MAXIMUM_TYPING_DELAY);
// };

// const typingIndicatorMessage = message => ({
//     recipient: { id: message.to },
//     channel: message.channel,
//     sender_action: 'typing_on',
// });

// const botSupportsTyping = bot => bot.startTyping;

// const isTypingMessage = message =>
//     message.sender_action && message.sender_action === 'typing_on';

// const typingMiddleware = (bot, message, next) => {
//     if (botSupportsTyping(bot) && !isTypingMessage(message)) {
//         const typingIndicator = typingIndicatorMessage(message);
//         const typingDelay = calculateTypingDelay(message);

//         bot.send(typingIndicator, () => {
//             setTimeout(() => next(), typingDelay);
//         });
//     } else {
//         next();
//     }
// };

module.exports = botkitMiddlewareTyping;
