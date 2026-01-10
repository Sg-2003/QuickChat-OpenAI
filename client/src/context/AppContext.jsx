import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyChats } from "../assets/assets";

const AppContext = createContext()

export const AppContextProvider = ({ children }) => {

    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    const fetchUser = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await fetch('http://localhost:3000/api/user/data', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                if (data.sucess) {
                    setUser(data.user);
                } else {
                    localStorage.removeItem('token');
                    setUser(null);
                }
            } catch (error) {
                console.error('Error fetching user:', error);
                localStorage.removeItem('token');
                setUser(null);
            }
        }
    }

    const login = (token) => {
        localStorage.setItem('token', token);
        fetchUser();
    }

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setChats([]);
        setSelectedChat(null);
        navigate('/login');
    }

    const fetchUsersChats = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await fetch('http://localhost:3000/api/chat/get', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                if (data.sucess) {
                    setChats(data.chats);
                    if (data.chats.length > 0) {
                        setSelectedChat(data.chats[0]);
                    } else {
                        // Create a new chat if none exist
                        await createNewChat();
                    }
                } else {
                    console.error('Failed to fetch chats:', data.message);
                }
            } catch (error) {
                console.error('Error fetching chats:', error);
            }
        }
    }

    const createNewChat = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await fetch('http://localhost:3000/api/chat/create', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                if (data.sucess) {
                    await fetchUsersChats(); // Refetch chats after creating new one
                } else {
                    console.error('Failed to create chat:', data.message);
                }
            } catch (error) {
                console.error('Error creating chat:', error);
            }
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
        fetchUser()
    }, [])


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
        logout
    }
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}
export const useAppContext = () => useContext(AppContext);