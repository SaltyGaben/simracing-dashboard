# SimRacing Dashboard

A modern, real-time dashboard for iRacing built with Nuxt.js. This dashboard connects seamlessly with the iRacing overlay tool to provide comprehensive race telemetry and statistics.

![Dashboard Preview](screenshot.png)

## Features

- Real-time race telemetry display
- Fuel calculations and strategy
- Live standings tracker
- Team information display
- Integration with iRacing overlay tool
- Modern, responsive design

## Prerequisites
- Bun
- iRacing overlay tool installed and running

## Setup

```bash
# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# bun
bun run dev
```

## Production

Build the application for production:

```bash
# bun
bun run build
```

Locally preview production build:

```bash
# bun
bun run preview
```

## Usage

1. Start the iRacing overlay tool first
2. Launch the dashboard using the development or production commands above
3. Access the dashboard at `http://localhost:3000`

## Configuration

This dashboard uses Convex as its database backend, which is shared with the iRacing overlay tool. To set up your environment:

1. Create a new project at [Convex](https://dashboard.convex.dev)

2. Create a `.env` file in the root directory with your Convex credentials:
```env
CONVEX_URL=your_convex_url
CONVEX_DEPLOYMENT=your_deployment_url
# Add any other required environment variables
```

3. The database schema and queries are located in the `convex/` directory:
   - `schema.ts`: Database schema definition
   - `drivers.ts`: Driver-related queries and mutations
   - `telemetry.ts`: Real-time telemetry handling

Make sure both this dashboard and the iRacing overlay tool are configured to use the same Convex project for proper data synchronization.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT License](LICENSE)

## Support

If you encounter any issues or have questions, please file an issue on GitHub.
