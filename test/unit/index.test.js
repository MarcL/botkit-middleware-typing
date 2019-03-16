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
        jest.useFakeTimers();

        spyNext = jest.fn();
        spyBotSend = jest.fn((message, callback) => callback());

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

    test('should set expected timeout delay', () => {
        const fakeMessage = 'fake message';

        const sendMiddleware = typingMiddleware();

        sendMiddleware(fakeBot, fakeMessage, spyNext);

        expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1210);
    });

    test('should set expected timeout delay when config.maximumTimeoutDelay is set', () => {
        const fakeMessage = 'fake message';
        const givenTimeoutDelay = 10;

        const sendMiddleware = typingMiddleware({
            maximumTypingDelayMs: givenTimeoutDelay,
        });

        sendMiddleware(fakeBot, fakeMessage, spyNext);

        expect(setTimeout).toHaveBeenCalledWith(
            expect.any(Function),
            givenTimeoutDelay
        );
    });

    test('should set expected timeout delay when config.timeoutDelay is set', () => {
        const fakeMessage = 'fake message';
        const givenTimeoutDelay = 10;

        const sendMiddleware = typingMiddleware({
            typingDelayMs: givenTimeoutDelay,
        });

        sendMiddleware(fakeBot, fakeMessage, spyNext);

        expect(setTimeout).toHaveBeenCalledWith(
            expect.any(Function),
            givenTimeoutDelay
        );
    });

    test('should call next after timeout', () => {
        const fakeMessage = 'fake message';

        const sendMiddleware = typingMiddleware();

        sendMiddleware(fakeBot, fakeMessage, spyNext);
        jest.runAllTimers();

        expect(spyNext).toHaveBeenCalledTimes(1);
    });
});
