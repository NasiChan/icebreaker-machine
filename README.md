# Icebreaker Machine 💬

> **"Icebreakers for dates, friends, and chaos moments."**

The **Icebreaker Machine** is a playful, mobile-first web application designed to generate conversation starters tailored to your specific social context. Whether you are on a first date, hanging out with friends, or trying to survive an awkward networking event, this app uses Google's Gemini AI to generate the perfect (or perfectly chaotic) questions.

## ✨ Features

### 🎛 The Chaos Engine
At the heart of the app is the **Chaos Slider**. It controls the "temperature" and tone of the AI:
*   **Level 1 (Safe & Wholesome):** Polite, family-friendly.
*   **Level 3 (Fun & Unhinged):** Quirky, unexpected scenarios.
*   **Level 5 (Max Chaos):** Absurdist, deep, or humorously controversial.

*Includes "fidget-friendly" UI with haptic feedback, reactive emoji animations, and jelly-physics on the slider.*

### 📋 List Generator Mode
*   Select a **Context** (e.g., First Date, New Classmates).
*   Add **Vibe Filters** (e.g., Deep, Silly, Philosophical).
*   Generates a batch of 10 unique questions.
*   **Copy** to clipboard or **Save** your favorites locally.

### 🍾 Spin the Bottle Mode
A digital twist on the classic game:
*   Add 2-12 player names.
*   Spin the virtual bottle (physics-based CSS animation).
*   The AI generates a **single, targeted question** specifically for the winner based on the current context and chaos level.

### 🎨 UX & Design
*   **Glassmorphism UI**: Frosted glass effects on a dark, animated background.
*   **Animated Background**: Floating, glowing blobs that drift organically.
*   **Responsive**: Optimized for mobile usage (perfect for pulling out at a bar).
*   **Local Storage**: Your "Saved Questions" persist between sessions.

---

## 🛠 Tech Stack

*   **Frontend Library**: React 19
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS (via CDN) + Custom CSS Keyframes
*   **AI Model**: Google Gemini 2.5 Flash (via `@google/genai` SDK)
*   **Icons**: Heroicons (Inline SVG)
*   **Font**: Inter (Google Fonts)

---

## 🚀 Getting Started

### Prerequisites
You need a Google Gemini API Key. You can get one from [Google AI Studio](https://aistudio.google.com/).

### Installation

1.  **Clone the files** into your project directory.
2.  **Environment Setup**:
    The application relies on `process.env.API_KEY`. Ensure your environment (bundler or runtime) injects this variable.
    
    *If using a standard Create React App or Vite setup:*
    Create a `.env` file in the root:
    ```bash
    REACT_APP_API_KEY=your_api_key_here
    # OR for Vite
    VITE_API_KEY=your_api_key_here
    ```

3.  **Run the App**:
    Depending on your bundler (npm start, npm run dev, etc.), launch the development server.

---

## 📂 Project Structure

*   **`App.tsx`**: Main controller. Handles state for modes (List vs. Spin), API calls, and layout.
*   **`services/geminiService.ts`**: Handles interactions with the Google GenAI SDK. Contains the system prompts and JSON schema definitions.
*   **`components/`**:
    *   `ControlPanel.tsx`: The main inputs (Context, Chaos Slider, Filters).
    *   `SpinBottle.tsx`: Logic and animation for the wheel/bottle game.
    *   `QuestionCard.tsx`: Display component for individual questions.
    *   `SavedList.tsx`: Collapsible drawer for favorited questions.
    *   `Background.tsx`: The floating blob background layer.
*   **`hooks/useLocalStorage.ts`**: Custom hook to persist saved questions.

---

## 🎮 How to Use

1.  **Choose your Context**: Tell the app where you are (e.g., "First Date").
2.  **Set Chaos Level**: Drag the slider. 
    *   *Tip: Level 5 vibrates and shakes!*
3.  **Select Vibes**: Optional tags to steer the AI (e.g., "Silly" + "Deep").
4.  **Generate**:
    *   **List Mode**: Click "Generate Questions" to get a list.
    *   **Spin Mode**: Switch modes at the top, add friends, and click "SPIN IT!".
5.  **Interact**: Click the **Copy** button to paste into a chat, or the **Star (⭐)** to save it for later.

---

## 📄 License

This project is open source. Feel free to use it to make your social interactions slightly more chaotic.
