# Islah 21

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js (LTS)](https://nodejs.org/en/download) - Currently we used Node.js 22
- [pnpm](https://pnpm.io/installation)

### Installation & Setup

1. **Clone the repository:**
    ```sh
    git clone <your-repository-url> # TODO: Replace <your-repository-url>
    cd islah-21 # Or your project directory name
    ```

2. **Install dependencies:**
    ```sh
    pnpm install
    ```

3. **Set up environment variables:**

    Copy the example environment file:
    ```sh
    cp .env.example .env
    ```
    Open the `.env` file and fill in the required values.
4. **Running the Development Server** 

    Once dependencies are installed and environment variables are configured, you can start the local development server:
    ```sh
    pnpm dev
    ```

This command should start the application on http://localhost:3000.

## 🏗️ Building for Production

- Setup environment variables
- Build and Deploy