# Logging Middleware and Notification System

This project contains two main parts:

1. Logging Middleware
2. Notification System Design

---

# 1. Logging Middleware

The logging middleware is used to send application logs to the evaluation logging API.

It uses the following details from `.env` file:

```env
BASE_URL=your_base_url
ACCESS_TOKEN=your_access_token
```

## Log Function

The `Log` function accepts:

```js
Log(stackName, severity, packageName, logMessage)
```
# 2. Notification System Design

The notification system is designed to support:

- Creating notifications
- Fetching notifications
