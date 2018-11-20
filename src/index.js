const AVERAGE_WORDS_PER_MINUTE = 85;
const AVERAGE_CHARACTERS_PER_MINUTE = AVERAGE_WORDS_PER_MINUTE * 7;
const DEFAULT_ATTACHMENT_TEXT_LENGTH = 80;

const calculateTypingDelay = response => {
  let textLength;

  if (typeof response === 'string') {
    textLength = response.length;
  } else if (response.text) {
    textLength = response.text.length;
  } else {
    textLength = DEFAULT_ATTACHMENT_TEXT_LENGTH;
  }

  return Math.min(
    Math.floor(textLength / (AVERAGE_CHARACTERS_PER_MINUTE / 60)) * 1000,
    5000
  );
};

const typingIndicatorMessage = (bot, message) => ({
  recipient: { id: message.to },
  channel: message.channel,
  sender_action: 'typing_on'
});
const botSupportsTyping = bot => bot.startTyping;

const isTypingMessage = message =>
  message.sender_action && message.sender_action === 'typing_on';

const botkitMiddlewareTyping = (bot, message, next) => {
  const send = () => {
    console.log('Bot typing middleware');
    if (botSupportsTyping(bot) && !isTypingMessage(message)) {
      const typingIndicator = typingIndicatorMessage(bot, message);
      const typingDelay = calculateTypingDelay(message);
      bot.send(typingIndicator, () => {
        setTimeout(() => next(), typingDelay);
      });
    } else {
      next();
    }
  };

  return {
    send
  };
};

module.exports = botkitMiddlewareTyping;
