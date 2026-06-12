import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

async function testAll() {
    console.log('--- Starting Integration Tests ---');
    
    // 1. User Registration
    console.log('\n[1] Registering test user...');
    const registerResponse = await axios.post(`${BASE_URL}/api/user/register`, {
        name: 'Automation Tester',
        email: `tester_${Date.now()}@example.com`,
        password: 'password123'
    });
    
    if (!registerResponse.data.success) {
        throw new Error('Registration failed: ' + registerResponse.data.message);
    }
    console.log('User registered successfully!');
    const token = registerResponse.data.token;
    const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

    // 2. Create Chat
    console.log('\n[2] Creating a new chat session...');
    const createChatResponse = await axios.get(`${BASE_URL}/api/chat/create`, authHeaders);
    if (!createChatResponse.data.success) {
        throw new Error('Chat creation failed: ' + createChatResponse.data.message);
    }
    console.log('Chat created!');

    // 3. Get Chats
    console.log('\n[3] Retrieving chat sessions...');
    const getChatsResponse = await axios.get(`${BASE_URL}/api/chat/get`, authHeaders);
    if (!getChatsResponse.data.success || getChatsResponse.data.chats.length === 0) {
        throw new Error('Could not retrieve created chat');
    }
    const chatId = getChatsResponse.data.chats[0]._id;
    console.log(`Retrieved Chat ID: ${chatId}`);

    // 4. Send Text Chat Message
    console.log('\n[4] Sending text chat prompt "Explain React in 1 sentence"...');
    const textMsgResponse = await axios.post(`${BASE_URL}/api/message/text`, {
        chatId,
        prompt: 'Explain React in 1 sentence'
    }, authHeaders);
    
    if (!textMsgResponse.data.success) {
        throw new Error('Text chat failed: ' + textMsgResponse.data.message);
    }
    console.log('Text Chat Response:', textMsgResponse.data.reply.content);

    // 5. Send Image Generation Message
    console.log('\n[5] Generating image for prompt "futuristic neon cyberpunk car" and publishing to community...');
    const imageMsgResponse = await axios.post(`${BASE_URL}/api/message/image`, {
        chatId,
        prompt: 'futuristic neon cyberpunk car',
        isPublished: true
    }, authHeaders);
    
    if (!imageMsgResponse.data.success) {
        throw new Error('Image generation failed: ' + imageMsgResponse.data.message);
    }
    console.log('Image generated successfully! ImageKit URL:', imageMsgResponse.data.reply.content);
    const generatedUrl = imageMsgResponse.data.reply.content;

    // 6. Verify Community Images
    console.log('\n[6] Verifying if image exists in the community feed...');
    const communityResponse = await axios.get(`${BASE_URL}/api/user/published-images`);
    if (!communityResponse.data.success) {
        throw new Error('Failed to retrieve community images: ' + communityResponse.data.message);
    }
    const matchedImage = communityResponse.data.images.find(img => img.imageUrl === generatedUrl);
    if (!matchedImage) {
        throw new Error('Generated image was not found in the community feed');
    }
    console.log(`Success! Found image published by ${matchedImage.userName} in community feed.`);

    // 7. Verify Stripe Checkout Session
    console.log('\n[7] Creating a Stripe Checkout session for Pro plan...');
    const purchaseResponse = await axios.post(`${BASE_URL}/api/credit/purchase`, {
        planId: 'pro'
    }, authHeaders);
    
    if (!purchaseResponse.data.success) {
        throw new Error('Stripe session creation failed: ' + purchaseResponse.data.message);
    }
    console.log('Stripe Session URL created successfully:', purchaseResponse.data.url);

    console.log('\n--- ALL TESTS PASSED SUCCESSFULLY! ---');
}

testAll().catch(err => {
    console.error('\n❌ Test failed with error:', err.message);
    if (err.response) {
        console.error('Response data:', err.response.data);
    }
    process.exit(1);
});
