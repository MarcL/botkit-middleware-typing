const typingMiddleware = require('../../src/index');

test('should return a function', () => {
    expect(typeof typingMiddleware).toBe('function');
});

describe('when typing is not supported by the bot platform', () => {
    let spyNext;
    const fakeBot = {
        startTyping: false,
    };

    beforeEach(() => {
        spyNext = jest.fn();
    });

    test('should call next', () => {
        const fakeMessage = {};
        const sendMiddleware = typingMiddleware();

        sendMiddleware(fakeBot, fakeMessage, spyNext);

        expect(spyNext.mock.calls.length).toBe(1);
    });
});

describe('when typing is supported by the bot platform', () => {
    let spyNext;
    let spyBotSend;
    let fakeBot;

    beforeEach(() => {
        spyNext = jest.fn();
        spyBotSend = jest.fn();

        fakeBot = {
            startTyping: true,
            send: spyBotSend,
        };
    });

    test('should call next if message contains typing indicator', () => {
        const fakeMessage = {
            sender_action: 'typing_on',
        };

        const sendMiddleware = typingMiddleware();

        sendMiddleware(fakeBot, fakeMessage, spyNext);

        expect(spyNext).toHaveBeenCalledTimes(1);
    });

    test('should call bot.send', () => {
        const fakeMessage = {};

        const sendMiddleware = typingMiddleware();

        sendMiddleware(fakeBot, fakeMessage, spyNext);

        expect(spyBotSend).toHaveBeenCalledTimes(1);
    });

    test('should call bot.send with expected message', () => {
        const expectedUserId = 'expectedUserId';
        const expectedChannel = 'expectedChannel';

        const fakeMessage = {
            to: expectedUserId,
            channel: expectedChannel,
        };

        const expectedMessage = {
            recipient: { id: expectedUserId },
            channel: expectedChannel,
            sender_action: 'typing_on',
        };

        const sendMiddleware = typingMiddleware();

        sendMiddleware(fakeBot, fakeMessage, spyNext);

        expect(spyBotSend).toHaveBeenCalledWith(
            expectedMessage,
            expect.any(Function)
        );
    });
});
