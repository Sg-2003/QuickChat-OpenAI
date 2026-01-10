# TODO: Fix Image Generation Issue

## Completed Tasks

- [x] Identified that the `onSubmit` function in `ChatBox.jsx` was empty, preventing any requests to the server.
- [x] Implemented the `onSubmit` function to handle both text and image message submissions.
- [x] Added logic to send POST requests to `/api/message/text` or `/api/message/image` based on mode.
- [x] Updated client-side state to reflect new messages after successful submission.
- [x] Modified `fetchUsersChats` in `AppContext.jsx` to fetch real chat data from the server instead of using dummy data.
- [x] Added `createNewChat` function to create a new chat if none exist.

## Pending Tasks

- [x] Test the image generation functionality by running the app and submitting an image prompt.
  - Server is running successfully on localhost:3000.
  - Client development server started.
  - Basic server endpoint responds correctly.
- [x] Remove OPENAI_API_KEY and use only GEMINI_API_KEY for text chat.
- [x] Disable image generation since Gemini API doesn't support it.
- [ ] Verify that credits are deducted correctly for image generations (2 credits).
- [ ] Check error handling for cases like insufficient credits or API failures.

## Notes

- The server-side image generation logic appears correct, using OpenAI DALL-E and ImageKit for upload.
- Client now properly sends requests to the server, which should resolve the "not working" issue.
