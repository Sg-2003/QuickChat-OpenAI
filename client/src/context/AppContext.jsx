import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyChats, dummyUserData } from "../assets/assets";
import axios from "axios";
import toast from "react-hot-toast";


axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;


const AppContext = createContext()

export const AppContextProvider = ({ children }) => {

    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [chatOffset, setChatOffset] = useState(0);
    const [hasMoreChats, setHasMoreChats] = useState(false);

    const fetchUser = async (authToken = token) => {
        try {
            const { data } = await axios.get('/api/user/data', {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            if (data.success) {
                setUser(data.user);
                if (isInitialLoad) {
                    setTimeout(() => {
                        toast.success("Welcome to QuickGPT");
                        setLoadingUser(false);
                    }, 2000); // 2 second delay
                    setIsInitialLoad(false);
                } else {
                    setLoadingUser(false);
                }
            } else {
                toast.error(data.message);
                setLoadingUser(false);
                // Clear invalid token
                localStorage.removeItem('token');
                setToken(null);
            }
        } catch (error) {
            toast.error(error.message);
            setLoadingUser(false);
            // Clear invalid token on auth error
            localStorage.removeItem('token');
            setToken(null);
        }
    }

    const login = (token) => {
        localStorage.setItem('token', token);
        setToken(token);
        toast.success('User login successful');
        fetchUser(token);
    }

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setChats([]);
        setSelectedChat(null);
        toast.success('User logout successful');
        navigate('/login');
    }

    const fetchUsersChats = async (loadMore = false) => {
        try {
            const limit = 10;
            const offset = loadMore ? chatOffset : 0;
            const { data } = await axios.get(`/api/chat/get?limit=${limit}&offset=${offset}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });
            if (data.success) {
                if (loadMore) {
                    setChats(prevChats => [...prevChats, ...data.chats]);
                    setChatOffset(prevOffset => prevOffset + data.chats.length);
                    setHasMoreChats(data.chats.length === limit);
                } else {
                    setChats(data.chats);
                    setChatOffset(data.chats.length);
                    setHasMoreChats(data.chats.length === limit);
                    // If the user has no chats, create One
                    if (data.chats.length === 0) {
                        await createNewChat();
                        return fetchUsersChats();
                    } else {
                        // for existing chat
                        setSelectedChat(data.chats[0]);
                    }
                }
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const createNewChat = async () => {
        try {
            if (!user) return toast.error('Login to create a new chat')
            navigate('/')
            await axios.get('/api/chat/create', { headers: { Authorization: `Bearer ${token}` } })
            toast.success('New chat created');
            await fetchUsersChats()
        } catch (error) {
            toast.error(error.message);
        }
    }

    const deleteChat = async (chatId) => {
        try {
            const { data } = await axios.post('/api/chat/delete', { chatId }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (data.success) {
                toast.success(data.message);
                await fetchUsersChats();
                if (selectedChat && selectedChat._id === chatId) {
                    setSelectedChat(null);
                }
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [theme])

    useEffect(() => {
        if (user) {
            fetchUsersChats()
        } else {
            setChats([])
            setSelectedChat(null)
        }
        localStorage.setItem('theme', theme);
    }, [user])

    useEffect(() => {
        if (token) {
            fetchUser(token)
        } else {
            setUser(null)
            setLoadingUser(false)
        }
    }, [token])


    const value = {
        navigate,
        user,
        setUser,
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        theme,
        setTheme,
        fetchUser,
        login,
        logout,
        createNewChat,
        loadingUser,
        setLoadingUser,
        fetchUsersChats,
        token,
        setToken,
        axios,
        deleteChat,
        hasMoreChats
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}
export const useAppContext = () => useContext(AppContext);