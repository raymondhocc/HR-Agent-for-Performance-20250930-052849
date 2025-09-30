# AuraHire: L'Occitane AI Interviewer

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/raymondhocc/HR-Agent-for-Performance-20250930-052748)

AuraHire is a sophisticated, AI-powered interview platform designed exclusively for L'Occitane. It streamlines the recruitment process for office staff and Beauty Host positions by conducting structured, unbiased interviews. The application leverages a minimalist and elegant user interface to create a welcoming experience for candidates.

The core objective is to identify candidates who align with L'Occitane's culture and possess the key competencies for success, thereby reducing bias, enhancing hiring quality, and improving retention.

## Key Features

- **AI-Driven Interviews:** Conducts structured interviews with trait-based and scenario-based questions.
- **HR Dashboard:** A clean, at-a-glance overview for HR personnel to manage candidates and interview stages.
- **Focused Interview Interface:** A distraction-free, chat-based UI for a calm and professional candidate experience.
- **Comprehensive Reporting:** Generates detailed reports with transcripts, competency scoring, and cultural fit analysis.
- **Stateful Conversations:** Utilizes Cloudflare Durable Objects to maintain persistent interview states.
- **Elegant & Minimalist UI:** A visually stunning and intuitive interface inspired by L'Occitane's brand aesthetic.

## Technology Stack

- **Frontend:** React, Vite, Tailwind CSS, shadcn/ui, Framer Motion
- **Backend:** Cloudflare Workers, Hono
- **State Management (Frontend):** Zustand
- **State Management (Backend):** Cloudflare Durable Objects (via Agents SDK)
- **AI Integration:** Cloudflare AI Gateway
- **Icons:** Lucide React
- **Data Visualization:** Recharts

## Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

- [Bun](https://bun.sh/) installed on your machine.
- A [Cloudflare account](https://dash.cloudflare.com/sign-up).
- The Wrangler CLI, which can be installed with `bun add -g wrangler`.

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/aurahire.git
    cd aurahire
    ```

2.  **Install dependencies:**
    ```sh
    bun install
    ```

3.  **Configure Cloudflare Environment Variables:**

    Create a `.dev.vars` file in the root of the project for local development. You will need to get your Account ID and create an AI Gateway.

    ```ini
    # .dev.vars
    CF_AI_BASE_URL="https://gateway.ai.cloudflare.com/v1/YOUR_ACCOUNT_ID/YOUR_GATEWAY_ID/openai"
    CF_AI_API_KEY="YOUR_CLOUDFLARE_API_KEY"
    ```

    For production, you'll need to set these as secrets using the Wrangler CLI:
    ```sh
    wrangler secret put CF_AI_API_KEY
    # You will be prompted to enter the secret value.
    # The CF_AI_BASE_URL is configured in wrangler.jsonc and can be overridden if needed.
    ```

4.  **Authenticate Wrangler:**
    Log in to your Cloudflare account.
    ```sh
    wrangler login
    ```

## Development

To run the application in development mode with hot-reloading:

```sh
bun run dev
```

This will start the Vite development server for the frontend and a local `workerd` instance for the backend, accessible at `http://localhost:3000`.

## Deployment

Deploy the application to your Cloudflare account with a single command. This will build the frontend, bundle the worker, and deploy everything to the Cloudflare network.

1.  **Run the deployment script:**
    ```sh
    bun run deploy
    ```

2.  **Or, deploy with one click:**

    [![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/raymondhocc/HR-Agent-for-Performance-20250930-052748)

## Project Structure

-   `src/`: Contains all the frontend React application code.
    -   `pages/`: Top-level page components.
    -   `components/`: Reusable UI components, including shadcn/ui.
    -   `lib/`: Utility functions and constants.
-   `worker/`: Contains the Cloudflare Worker backend code.
    -   `index.ts`: The entry point for the worker.
    -   `userRoutes.ts`: Hono API route definitions.
    -   `agent.ts`: The core `ChatAgent` Durable Object class.
    -   `chat.ts`: Handles AI model interaction and logic.
-   `wrangler.jsonc`: Configuration file for the Cloudflare Worker, including bindings and build settings.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.