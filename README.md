# Mood Bloom

Mood Bloom is a personal journaling application designed to help you track your mood, uncover patterns, and nurture your emotional well-being. It provides a simple, intuitive interface to log your daily feelings and offers AI-powered insights to help you understand what influences your mood.

## ✨ Key Features

- **Daily Mood Logging**: Quickly log your mood from a selection of five distinct feelings.
- **Notes & Tagging**: Add detailed notes to your entries and organize them with custom tags.
- **AI-Powered Tag Suggestions**: Get intelligent tag suggestions based on your notes to help you categorize your thoughts and feelings more effectively.
- **Interactive Calendar**: Visualize your mood history on a color-coded calendar to easily spot trends and patterns.
- **Mood Trends Analysis**: View charts that summarize your mood distribution over the week and month.
- **Secure Authentication**: User accounts are managed securely with Firebase Authentication, supporting both email/password and Google sign-in.
- **PDF Export**: Export your entire mood history to a PDF for your personal records.

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **AI Integration**: [OpenRouter](https://openrouter.ai/) for tag suggestions
- **Backend & Database**: [Firebase](https://firebase.google.com/) (Authentication & Firestore)
- **Form Management**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) for validation

## 🏁 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/en) (v18 or newer recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/mood-bloom.git
    cd mood-bloom
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Set up environment variables**

    Create a file named `.env.local` in the root of your project and add your OpenRouter API key. You can get a key from the [OpenRouter website](https://openrouter.ai/).

    ```env
    OPENROUTER_API_KEY="your_openrouter_api_key"
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

    Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## 📜 Available Scripts

- `npm run dev`: Runs the app in development mode.
- `npm run build`: Builds the app for production.
- `npm run start`: Starts a production server.
- `npm run lint`: Lints the codebase for errors.

## ☁️ Deployment

This application is ready to be deployed on platforms like [Vercel](https://vercel.com/) or [Firebase App Hosting](https://firebase.google.com/docs/hosting).

When deploying, make sure to set the `OPENROUTER_API_KEY` as an environment variable in your hosting provider's settings to ensure the AI features work correctly in production.
