# Dorley Jr WhatsApp Bot

Node.js WhatsApp bot built with the Baileys library, terminal QR authentication, structured logging, and environment based configuration.

## Status

Node.js messaging application

## Key capabilities

- WhatsApp Web connection through Baileys
- QR code authentication
- Structured logging with Pino
- Development reload support with Nodemon

## Technology

- Project specific source files

## Local development

Requirements: Node.js and npm.

```bash
npm install
npm run dev
```

### Available commands

| Command | Purpose |
| --- | --- |
| `npm run start` | `node index.js` |
| `npm run dev` | `nodemon index.js` |

## Configuration

External service credentials must be supplied through local or deployment environment variables. Add a sanitized `.env.example` before onboarding additional developers. Keep all real credentials outside version control.

## Project structure

| Path | Purpose |
| --- | --- |
| `.github/` | GitHub workflows and repository automation |

## Security

- Keep credentials and production environment files out of version control.
- Review authentication, authorization, database policies, and input validation before production use.
- Run the available lint, type checking, test, and build commands before deployment.

## License

No license file is currently included. All rights are reserved unless the repository owner states otherwise.

## Maintainer

Morris L. Dorley Jr, [@Moriis21](https://github.com/Moriis21)

