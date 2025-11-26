# म Yatri - Smart Public Transportation for Nepal


**म Yatri** (trans. *Maya Yatri*) is a modern, collaborative mobility platform designed to enhance the public transportation experience in Nepal. The application provides real-time bus tracking, direct communication channels, and role-based management tools for passengers, drivers, and administrators.

The project's tagline is "मेरो यात्रा, सजिलो यात्रा" (My Journey, An Easy Journey).

## Key Features

*   **Role-Based Dashboards:** Tailored interfaces for Passengers, Drivers, and Administrators with role-specific functionalities.
*   **Live Bus Tracking:** Passengers can view nearby buses on an interactive map powered by React Leaflet, complete with estimated arrival times (ETAs) and occupancy levels.
*   **Driver-Passenger Communication:** A built-in chat widget allows passengers to communicate directly with drivers of buses they have recently traveled on.
*   **Service Request System:** Passengers can "ping" a bus to notify the driver they are waiting. Drivers receive these requests on their dashboard and can acknowledge them.
*   **Admin Verification Panel:** Administrators have a dedicated dashboard to manage the fleet, view system statistics, and approve or reject new driver and bus registrations.
*   **Authentication & Profiles:** Secure user authentication and profile management for all roles, using Supabase for backend services.
*   **Trip History:** Passengers can review a detailed history of their past service requests and their corresponding statuses.

## Technology Stack

*   **Frontend:** React, TypeScript, Vite
*   **Styling:** Tailwind CSS with shadcn/ui components
*   **Backend & Database:** Supabase
*   **Mapping:** React Leaflet & OpenStreetMap
*   **State Management:** Client-side state managed with custom stores using `localStorage`
*   **Routing:** React Router

## Getting Started

To run this project locally, you will need Node.js and npm installed.

### 1. Environment Setup

The application requires a Supabase backend for authentication and data storage.

1.  Clone the repository:
    ```bash
    git clone https://github.com/nabinthapaofc-stack/maya-yatri-track.git
    cd maya-yatri-track
    ```

2.  Create a `.env` file by copying the example:
    ```bash
    cp .env.example .env
    ```

3.  Set up a new project on [Supabase](https://supabase.com/).

4.  In your Supabase project, create the following tables: `app_users`, `drivers`, and `buses`. The schemas can be inferred from the service files in `src/services/`.

5.  Navigate to your Supabase project's **Settings > API** to find your Project URL and `anon` public key.

6.  Add these credentials to your `.env` file:
    ```env
    VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
    VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_PUBLIC_KEY
    ```

### 2. Installation and Running

Once your environment is configured, install the dependencies and start the development server.

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Start the development server:
    ```bash
    npm run dev
    ```

The application will now be running at `http://localhost:8080`.

## Project Structure

The codebase is organized to separate concerns for scalability and maintainability.

```
/
├── public/              # Static assets
└── src/
    ├── assets/            # Images and other static assets
    ├── components/        # Reusable React components (UI, Map, Chat)
    ├── data/              # Mock data for demonstration
    ├── hooks/             # Custom React hooks
    ├── lib/               # Core logic, Supabase client, and state stores
    ├── pages/             # Top-level components for each route/page
    │   ├── admin/
    │   ├── driver/
    │   └── passenger/
    └── services/          # Functions for backend communication
```

*   **`src/pages`**: Contains the primary components for each page, organized by user role (`passenger`, `driver`, `admin`).
*   **`src/components`**: Houses reusable React components, including UI elements from `shadcn/ui`, the `PassengerMap`, and the `ChatWidget`.
*   **`src/services`**: Includes functions that interact with the Supabase backend for authentication (`authService.ts`) and data management (`driverService.ts`).
*   **`src/lib`**: Contains the Supabase client initialization (`supabaseClient.ts`), client-side state management stores (`chatStore.ts`, `passengerStore.ts`), and other utility functions.
