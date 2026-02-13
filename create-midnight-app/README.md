# create-midnight-app-new

Scaffold a Midnight dApp project.

## Usage

```bash
npx create-midnight-app-new my-project
```

## What's included

| Directory | Description |
|---|---|
| `midnight-local-network/` | Local Midnight node via Docker + wallet funding scripts |
| `midnight-starter-template/` | Counter dApp starter — smart contracts (Compact) + CLI + tests |

## Prerequisites

- Node.js 20+
- Docker (for local network)
- [Midnight Compact compiler](https://docs.midnight.network/) (for contract compilation)

## Quick start

```bash
npx create-midnight-app-new my-project

# Start local network
cd my-project/midnight-local-network
docker compose up -d
npm install && npm run fund

# Build contracts
cd ../midnight-starter-template/counter-contract
npm install && npm run build

# Run tests
cd ../counter-cli
npm install && npm test
```

## Development

To update bundled templates from the repo:

```bash
cd create-midnight-app-new
bash sync-templates.sh
npm publish
```
