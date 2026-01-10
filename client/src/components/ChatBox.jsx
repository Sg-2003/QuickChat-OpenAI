import React, { useEffect, useRef, useState } from 'react'
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import Message from './Message';

const ChatBox = () => {

  const containerRef = useRef(null);

  const { selectedChat, theme } = useAppContext();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState('text');
  const [isPublished, setIsPublished] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!prompt.trim()) return;

    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first');
      setLoading(false);
      return;
    }

    const endpoint = mode === 'image' ? '/api/message/image' : '/api/message/text';
    const body = { chatId: selectedChat._id, prompt, ...(mode === 'image' && { isPublished }) };

    try {
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (data.success) {
        const userMessage = {
          role: 'user',
          content: prompt,
          timestamp: Date.now(),
          isImage: false,
        };
        const newMessages = [...messages, userMessage, data.reply];
        setMessages(newMessages);

        // Update selectedChat in context
        const updatedChat = { ...selectedChat, messages: newMessages };
        setSelectedChat(updatedChat);

        // Update chats in context
        setChats(prevChats => prevChats.map(chat => chat._id === selectedChat._id ? updatedChat : chat));

        setPrompt('');
        setIsPublished(false);
      } else {
        alert(data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages);
    }
  }, [selectedChat]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
      })
    }
  }, [messages]);


  return (
    <div className='flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-40'>
      {/*Chat Messages*/}
      <div ref={containerRef} className="flex-1 mb-5 overflow-y-scroll">
        {messages.length === 0 && (
          <div className="h-full flex flex-col justify-center items-center gap-2 text-primary">
            <img src={theme === 'dark' ? assets.logo_full : assets.logo_full_dark} className="w-full max-w-56 sm:max-w-68" />
            <p className='mt-5 text-4xl sm:text-6xl text-center text-gray-400 dark:text-white'>Ask me, anything.</p>
          </div>
        )}
        {messages.map((message, index) => <Message message={message} key={index} />)}
        {/*Three Dot Animation*/}
        {loading && <div className='loader flex items-center gap-1.5'>
          <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark: bg-white animate-bounce"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark: bg-white animate-bounce"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark: bg-white animate-bounce"></div>
        </div>
        }
      </div>
      {mode === 'image' && (
        <label className="inline-flex items-center gap-2 mb-3 text-sm mx-auto">
          <p className='text-xs'>Publish Generated Image to Community</p>
          <input type="checkbox" className='cursor-pointer' checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
        </label>
      )}
      {/*Prompt Input Box*/}
      <form onSubmit={onSubmit} className="bg-primary/20 dark:bg-[#57317C]/30 border border-primary dark:border-[#80609f]/30 rounded-full w-full max-w-2xl p-3 pl-4 mx-auto flex items-center gap-4">
        <select onChange={(e) => setMode(e.target.value)} value={mode} className="text-sm pl-3 pr-2 outline-none">
          <option className='dark: bg-purple-900' value="text">Text</option>
          <option className='dark: bg-purple-900' value="image">Image</option>
        </select>
        <input onChange={(e) => setPrompt(e.target.value)} value={prompt} type="text" placeholder='Type your prompt here...' className='w-full flex-1 text-sm outline-none' required />
        <button disabled={loading} >
          <img src={loading ? assets.stop_icon : assets.send_icon} className="w-8 cursor-pointer" />
        </button>
      </form>
    </div>
  )
}

export default ChatBox