# ⚡ QuickChat AI - Full-Stack MERN AI Platform

QuickChat AI is a premium, full-stack MERN (MongoDB, Express, React, Node.js) web application that empowers users with AI-driven text communication and custom image generation. Operating on a tiered credit system, users can converse with advanced LLMs, generate stunning images, publish creations to a community gallery, and purchase credit packages through a secure Stripe payment pipeline.

---

## 🌟 Key Features

*   💬 **Intelligent Chat Assistant** – Interactive real-time conversation powered by OpenAI's `gpt-3.5-turbo` with automated fallback to Google Gemini (`gemini-2.5-flash`) for unmatched service resilience.
*   🎨 **AI Image Generation** – Custom image generation using OpenAI DALL-E 2 (with LoremFlickr fallback). Generated images are optimized and stored in the cloud via **ImageKit**.
*   🪙 **Action-Based Credits System** – Integrated credit validation mechanism (1 credit for text generations, 2 credits for image generations).
*   💳 **Stripe Checkout & Webhook Integration** – Standard checkout flow for credit pack purchases (Basic, Pro, Premium) backed by secure Stripe Webhook event handlers.
*   🤝 **Community Gallery** – A public showcase feed where users can publish and browse AI-generated images.
*   💻 **Syntax & Markdown Highlighting** – Rendered AI chat responses support rich Markdown layout and programming syntax styling via **PrismJS** and **React Markdown**.
*   📱 **Premium UI/UX Design** – Responsive dashboard interface featuring glassmorphism, smooth CSS transitions, notifications via **React Hot Toast**, and a dedicated dark theme.

---

## 🛠️ Technology Stack

### Frontend (Client)
*   **React 19** – Component-based User Interface framework.
*   **Vite** – Next-generation, high-performance frontend build tool.
*   **Tailwind CSS v4** – Modern utility-first CSS styling engine.
*   **React Router Dom v7** – Dynamic frontend client-side routing.
*   **Axios** – Promise-based HTTP client for API communication.
*   **React Hot Toast** – Aesthetic, responsive toast notifications.
*   **React Markdown & PrismJS** – Content rendering with source code blocks syntax highlighting.

### Backend (Server)
*   **Node.js & Express** – High-throughput application framework.
*   **MongoDB & Mongoose** – NoSQL database for flexible data modeling.
*   **OpenAI SDK** – Standard wrapper for GPT and DALL-E endpoints.
*   **Google Generative AI SDK** – API interface for Gemini models.
*   **Stripe SDK** – Online payment processing suite.
*   **ImageKit SDK** – Cloud image hosting, optimization, and transformation.
*   **JSON Web Tokens (JWT) & Bcryptjs** – Secure token-based user authentication and salted password hashing.

---

## 📁 Project Structure

```text
QuickChat/
├── client/                     # React Frontend Application
│   ├── src/
│   │   ├── assets/             # Icons, CSS styles (including Prism themes)
│   │   ├── components/         # ChatBox, Sidebar, Message components
│   │   ├── context/            # React AppContext (Global State & User Fetching)
│   │   ├── pages/              # Login, Credits, Community, Loading pages
│   │   ├── App.jsx             # Main Application routing & view coordinator
│   │   └── main.jsx            # Application bootstrap entry point
│   ├── package.json            # Frontend dependency registry
│   └── vite.config.js          # Vite configuration
│
├── server/                     # Express Backend Application
│   ├── configs/                # MongoDB, OpenAI, Gemini, ImageKit connections
│   ├── controllers/            # Request handlers (User, Chat, Message, Credits, Webhooks)
│   ├── middlewares/            # Auth and request pre-processing
│   ├── models/                 # Mongoose schemas (User, Chat, Transaction)
│   ├── routes/                 # Express route entrypoints
│   ├── testAllFlows.js         # Integration and end-to-end testing script
│   ├── server.js               # Application entry point
│   └── package.json            # Backend dependency registry
│
└── TODO.md                     # Action items checklist
```

---

## ⚙️ Environment Configuration

To run the project, you need to set up environment variables in both the client and server directories.

### 1. Server Configuration
Create a `.env` file in the `server/` directory and configure the following parameters:

```env
# Server Running Environment
PORT=3000
JWT_SECRET=your_jwt_secret_key

# Database
MONGODB_URI=your_mongodb_connection_string

# AI Providers
OPENAI_API_KEY=your_openai_api_key
GEMINI_API_KEY=your_google_gemini_api_key

# Payment Processing (Stripe)
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Image Management (ImageKit)
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

### 2. Client Configuration
Create a `.env` file in the `client/` directory and configure:

```env
VITE_SERVER_URL=http://localhost:3000
```

---

## 🚀 Getting Started

Follow these steps to clone the repository and run QuickChat AI locally.

### Prerequisites
*   Node.js (v18+ recommended)
*   MongoDB Instance (Local or MongoDB Atlas)
*   Stripe Account (For developer test keys)
*   ImageKit Account (Free tier endpoint keys)

### Step 1: Clone the Repository
```bash
git clone https://github.com/Sg-2003/QuickChat-OpenAI.git
cd QuickChat-OpenAI
```

### Step 2: Set Up the Backend
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure the `.env` file based on the environment configuration section.
4. Start the development server (runs with nodemon):
   ```bash
   npm run server
   ```

### Step 3: Set Up the Frontend
1. Open a new terminal and navigate to the client folder:
   ```bash
   cd ../client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure the `.env` file.
4. Start the Vite development server:
   ```bash
   npm run dev
   ```

---

## 🔌 API Reference

### User Authentication & Feeds
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/user/register` | Register a new user | No |
| `POST` | `/api/user/login` | Login user and return JWT | No |
| `GET` | `/api/user/get` | Get authenticated user info | Yes (Bearer Token) |
| `GET` | `/api/user/published-images` | Fetch shared community images | No |

### Chat Session Management
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/chat/create` | Open a new chat session | Yes (Bearer Token) |
| `GET` | `/api/chat/get` | Get all chat sessions for user | Yes (Bearer Token) |
| `POST` | `/api/chat/delete` | Delete a specific chat session | Yes (Bearer Token) |

### Messaging & AI Actions
| Method | Endpoint | Description | Auth Required | Cost |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/message/text` | Prompt text-based AI response | Yes (Bearer Token) | 1 Credit |
| `POST` | `/api/message/image` | Trigger image generation | Yes (Bearer Token) | 2 Credits |

### Credits & Stripe Integration
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/credit/plans` | Fetch available credit plans | No |
| `POST` | `/api/credit/purchase` | Initiate Stripe Checkout session | Yes (Bearer Token) |
| `POST` | `/api/stripe` | Handle Stripe webhooks (raw JSON) | No |

---

## 🧪 Integration Testing

QuickChat AI includes a comprehensive integration test suite that tests the end-to-end lifecycle.

### Running Tests
To run the automated flows (registration, chat creation, message dispatch, image generation, community listing, and Stripe session generation):

1. Make sure your local MongoDB and Server are running.
2. Navigate to the `server/` directory.
3. Execute:
   ```bash
   node testAllFlows.js
   ```

Upon success, you should see logs validating each process step, culminating in:
`--- ALL TESTS PASSED SUCCESSFULLY! ---`
