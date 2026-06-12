# TODO: Make Credit Purchase Functional

- [x] Edit client/src/pages/Credits.jsx: Add onClick handler to "Buy Now" button to call handlePurchase(plan._id)
- [x] Edit server/routes/creditRoutes.js: Change route from '/plan' to '/plans' to match client request
- [x] Edit server/controllers/webhooks.js: Change webhook event from 'payment_intent.succeeded' to 'checkout.session.completed' and simplify handling
- [ ] Test the purchase flow: Click buy, redirect to Stripe, complete payment, verify credits updated

# TODO: Fix Login Page Authorization Header

- [x] Fix inconsistent Authorization header in AppContext.jsx fetchUser function to include "Bearer " prefix
- [x] Start client and server to test login functionality

# TODO: Fix Chat Container AI Response Issue

- [x] Add checks for chat existence and API key in messageController.js
- [x] Change Gemini model from "gemini-1.5-flash" to "gemini-1.5-pro" to fix 404 error
- [x] Switch back to direct GoogleGenerativeAI API instead of OpenAI-compatible API to resolve 404 issues
- [x] Change model to "gpt-3.5-turbo" to use OpenAI API instead of Gemini, as the OpenAI-compatible API was causing 404 errors
- [x] Update openai.js to use OPENAI_API_KEY for text chat and update API key check in messageController.js
- [x] Update API key check in messageController.js to check for OPENAI_API_KEY instead of GEMINI_API_KEY
- [x] Update API key check in messageController.js to check for OPENAI_API_KEY instead of GEMINI_API_KEY
- [x] Update API key check in messageController.js to check for OPENAI_API_KEY instead of GEMINI_API_KEY
- [x] Update API key check in messageController.js to check for OPENAI_API_KEY instead of GEMINI_API_KEY
- [x] Switched text chat from Gemini to OpenAI API in messageController.js
- [x] Created server/configs/openai.js with OpenAI initialization
- [x] Updated API key check to OPENAI_API_KEY in messageController.js
- [ ] Test the chat functionality to ensure AI responses work correctly (code changes implemented, testing requires valid OPENAI_API_KEY)
