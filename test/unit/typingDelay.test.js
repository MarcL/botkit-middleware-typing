const typingDelay = require('../../src/typingDelay');

describe('should return expected delay when', () => {
    test('response is a string', () => {
        const delay = typingDelay('fake message');

        expect(delay).toBe(1210);
    });

    test('response contains a message', () => {
        const delay = typingDelay({ text: 'another fake message' });

        expect(delay).toBe(2016);
    });

    test('response does not contain a message', () => {
        const delay = typingDelay({});

        expect(delay).toBe(4033);
    });

    test('response is longer than maximum default typing delay', () => {
        const delay = typingDelay(
            'a very long string that should return the default typing delay'
        );

        expect(delay).toBe(5000);
    });

    test('response is too long but maximum delay is set', () => {
        const maximumTypingDelay = 100;
        const delay = typingDelay(
            'a very long string that should return the default typing delay',
            maximumTypingDelay
        );

        expect(delay).toBe(maximumTypingDelay);
    });
});
