# Playwright MailHog Utils

A lightweight utility class for interacting with [MailHog](https://github.com/mailhog/MailHog) in Playwright end-to-end tests.

## Features

This utility allows you to:
- Wait for emails to arrive
- Get verification codes or download links from email headers
- Delete all emails in MailHog (local only)

## Setup

1. Install Playwright:

```bash
npm install --save-dev @playwright/test
```

2. Run MailHog with Docker

Use the provided docker-compose.yml to start MailHog locally:

```bash
docker-compose up -d
```

Web UI: http://localhost:8025 \
SMTP: http://localhost:1025


