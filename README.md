# botkit-middleware-typing

BotKit middleware to enable the typing indicator on [Facebook](#issues) for all messages. This will include those sent via [Botkit conversations](https://botkit.ai/docs/core.html#multi-message-conversations).

## Install

Add the module to your `package.json` using either `npm` or `yarn`.

```
npm install botkit-middleware-typing
```

OR

```
yarn add botkit-middleware-typing
```

## Use

Include the middleware in your Botkit application.

```
const botkitTypingMiddleware = require('botkit-middleware-typing');
```

Add this as a [Botkit send middleware](https://botkit.ai/docs/middleware.html#send-middleware):

```
const controller = Botkit.facebookbot(botConfig);

const typingMiddleware = botkitTypingMiddleware();

controller.middleware.send.use(typingMiddleware);
```

## Configuration

You can configure the typing delay for the middleware with the following optional parameters.
This will allow you to set a maximum delay or allows you to set a delay for all typing.

| Property             |                  Description                  |
| -------------------- | :-------------------------------------------: |
| maximumTypingDelayMs | Sets the maximum typing delay in milliseconds |
| typingDelayMs        | Sets a specified typing delay in milliseconds |

### Examples

Set the maximum typing delay to 1 second.

```
const typingMiddleware = botkitTypingMiddleware({
    maximumTypingDelayMs: 1000
});

controller.middleware.send.use(typingMiddleware);
```

Set all typing delays to 4.5 seconds.

```
const typingMiddleware = botkitTypingMiddleware({
    typingDelayMs: 4500
});

controller.middleware.send.use(typingMiddleware);
```

## Issues

With the current implementation of Botkit, there's no easy way to tell which platform the bot is running on. This middleware makes an assumption that the bot supports typing if it has a `bot.startTyping` method. This is currently avaible on Facebook and Slack. Currently only Facebook is supported but I'll look to add Slack shortly.
