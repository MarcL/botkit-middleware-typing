const AVERAGE_WORDS_PER_MINUTE = 85;
const AVERAGE_CHARACTERS_PER_MINUTE = AVERAGE_WORDS_PER_MINUTE * 7;
const AVERAGE_CHARACTERS_PER_SECOND = AVERAGE_CHARACTERS_PER_MINUTE / 60;
const DEFAULT_ATTACHMENT_TEXT_LENGTH = 40;
const DEFAULT_MAXIMUM_TYPING_DELAY_MILLISECONDS = 5 * 1000;

const typingDelay = (
    response,
    maximumTypingDelayMilliseconds = DEFAULT_MAXIMUM_TYPING_DELAY_MILLISECONDS
) => {
    let textLength;
    if (typeof response === 'string') {
        textLength = response.length;
    } else if (response.text) {
        textLength = response.text.length;
    } else {
        textLength = DEFAULT_ATTACHMENT_TEXT_LENGTH;
    }

    const textSpeedMilliseconds = Math.floor(
        (textLength / AVERAGE_CHARACTERS_PER_SECOND) * 1000
    );

    return Math.min(textSpeedMilliseconds, maximumTypingDelayMilliseconds);
};

module.exports = typingDelay;
