# npmview

A modern, high-performance npm package viewer built to explore the capabilities of the TanStack ecosystem and React 19.

> [!IMPORTANT]
> **This project is created solely for learning, experimentation, and entertainment purposes.** It is not intended to replace the official npm registry or other package viewers.

## 🚀 Features

- **Server-Side Rendering (SSR)**: Powered by TanStack Start for optimal performance and SEO.
- **Type-Safe Routing**: File-based routing with TanStack Router.
- **Efficient Data Fetching**: Caching and synchronization with TanStack Query v5.
- **High-Performance Caching**: Redis integration for server-side caching of npm registry data.
- **Modern UI**: Styled with Tailwind CSS v4 and accessibility-first components.
- **Robust Testing**: End-to-end testing with Playwright.

## 🛠️ Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [TanStack Query](https://tanstack.com/query)
- **Routing**: [TanStack Router](https://tanstack.com/router)
- **Database/Cache**: [Redis](https://redis.io/) (via ioredis)
- **Testing**: [Playwright](https://playwright.dev/)
- **Package Manager**: [pnpm](https://pnpm.io/)

## 🏁 Getting Started

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v20+ recommended)
- [pnpm](https://pnpm.io/) (v10.28.2)
- [Docker](https://www.docker.com/) (for Redis)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/janszotkowski/npmview.git
   cd npmview
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Start the Redis instance:**
   The project uses Redis for caching, configured to run on port `6380` via Docker.
   ```bash
   docker-compose up -d
   ```

4. **Start the development server:**
   ```bash
   pnpm run dev
   ```
   The application will be available at `http://localhost:3000`.

## 📜 Scripts

- `pnpm run dev`: Starts the development server.
- `pnpm run build`: Builds the application for production.
- `pnpm run start`: Starts the production build.
- `pnpm run lint`: Runs ESLint to check for code quality issues.
- `pnpm run lint:fix`: Automatically fixes linting errors.
- `pnpm run test:e2e`: Runs end-to-end tests with Playwright.

## 🤝 Contributions & Feedback

I would be thrilled if you find this project useful or interesting! I am strictly open to feedback, suggestions for improvement, and any advice you might have to make this project better. Feel free to open an issue or submit a pull request.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
