# Privmat - Your Privacy Matters 🛡️

Privmat is a modern privacy dashboard designed to empower users by providing visibility and control over their digital footprint. Track data shared with apps, generate disposable data for signups, monitor for data breaches affecting your accounts, and securely store sensitive information.

**The Problem:** In today's digital world, it's easy to lose track of which services have our personal data (email, phone, location, etc.). This lack of visibility increases our risk exposure in data breaches and reduces our control over our own information.

**The Solution:** Privmat provides a centralized dashboard to manage and understand your online privacy, offering tools to mitigate risks and make informed decisions.

## ✨ Key Features

*   **👤 User Authentication:** Secure sign-up and login managed by Clerk (supports email/password and potentially social logins).
*   **📊 Tracked Apps Dashboard:**
    *   Manually add applications/services you use.
    *   Record the types of data shared (email, phone, location access).
    *   Add personal notes for each tracked app.
    *   View all tracked apps in a clear, organized list.
    *   Edit and delete tracked app entries.
*   **💯 Data Risk Score:**
    *   Calculates a risk score for each tracked app based on the sensitivity of data shared and known breaches associated with the app's domain.
    *   Displays an overall risk score on the dashboard, providing a quick assessment of your exposure level (Low, Medium, High, Critical).
*   **🎭 Fake Data Generator:**
    *   Generate realistic fake names, emails, phone numbers, etc. (using Faker.js).
    *   (Optional: Integrate with MailTM API for functional temporary emails - *verify if implemented*).
    *   Save generated data presets for repeated use.
*   **🔑 Data Vault:**
    *   Securely store sensitive information like passwords, notes, or license keys.
    *   Utilizes server-side encryption (AES-256-CBC) for stored credentials.
    *   Requires a separate vault password/authentication step for enhanced security (*verify implementation detail*).
*   **🚨 Data Breach Monitoring:**
    *   Check if your email addresses have been involved in known data breaches using the XposedOrNot API.
    *   Stores details of breaches affecting the user.
    *   Displays breach information clearly.


## 💻 Tech Stack

*   **Framework:** Next.js (App Router)
*   **Language:** JavaScript
*   **Authentication:** Clerk
*   **Database:** PostgreSQL (e.g., Neon DB)
*   **ORM:** Prisma
*   **Styling:** Tailwind CSS
*   **UI Components:** ShadCN/UI
*   **API (Breaches):** XposedOrNot
*   **API (Temp Email):** MailTM
*   **Data Generation:** Faker.js
*   **Deployment:** (vercel)

## 🚀 Getting Started

Follow these instructions to set up the project locally for development.

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm, yarn, or pnpm
*   PostgreSQL Database instance
*   Clerk Account (for API keys)
*   Git

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd privmat
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```
3.  **Set up environment variables:**
    *   Create a `.env.local` file in the root directory.
    *   Copy the contents of `.env.example` (if you create one) into `.env.local`.
    *   Fill in the required environment variables:

        ```dotenv
        # PostgreSQL Connection URL (replace with your actual DB connection string)
        DATABASE_URL="postgresql://user:password@host:port/database?schema=public"

        # Clerk API Keys (get these from your Clerk dashboard)
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_*************************
        CLERK_SECRET_KEY=sk_test_*************************

        # Clerk Webhook Secret (if using webhooks for user sync - get from Clerk dashboard)
        # CLERK_WEBHOOK_SECRET=whsec_*************************

        # Optional: XposedOrNot API Key (if required by their terms later)
        # XPOSEDORNOT_API_KEY=your_xposedornot_api_key
        ```

4.  **Set up the database:**
    *   Ensure your PostgreSQL server is running.
    *   Apply database migrations using Prisma:
        ```bash
        npx prisma migrate dev
        ```
        *(This will create the necessary tables based on `prisma/schema.prisma`)*
    *   Generate the Prisma Client:
        ```bash
        npx prisma generate
        ```

5.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```
6.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage

1.  **Sign Up / Sign In:** Create an account or log in using Clerk.
2.  **Dashboard:** Get an overview of your tracked apps, overall risk score, vault items, and breach status.
3.  **Track Apps:** Navigate to the "Apps Tracking" section to add applications you use and the data you've shared.
4.  **Generate Fake Data:** Use the "Fake Data Generator" to create disposable information for non-essential signups.
5.  **Data Vault:** Store sensitive credentials securely. Remember your vault password if implemented!
6.  **Check Breaches:** Use the "Data Breaches" section to check your emails against known breaches.

## 🗺️ Roadmap (Future Features)

*   [ ] Automated App Tracking (e.g., via email parsing or browser extension).
*   [ ] More sophisticated Risk Scoring (factoring in privacy policies, app reputation).
*   [ ] Privacy Tips section with actionable advice.
*   [ ] Secure File Storage in Data Vault.
*   [ ] Ability to request data deletion from services (integration needed).
*   [ ] Enhanced visualizations and reporting.
*   [ ] Team/Family sharing features.

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

Please open an issue first to discuss significant changes.

## 📄 License

This project is licensed under the [MIT License](LICENSE).
