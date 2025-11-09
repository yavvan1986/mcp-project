import React, { useState, useRef, useEffect } from 'react';
// The import for './chatApi' is removed to resolve the "Could not resolve" error. 

// --- API Logic (Merged for single-file compatibility) ---
const CHAT_API_URL = "http://localhost:8080/sendChat";

/**
 * Sends the user's message to the backend API.
 * This function is defined locally to resolve import errors.
 * @param {string} message The text message to send.
 * @returns {Promise<string>} The bot's reply text.
 * @throws {Error} If the connection fails or the API returns an error status.
 */
const sendMessageToBackend = async (message) => {
    try {
        const response = await fetch(CHAT_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "userMessage": message }),
        });
        console.log("respponse: "+response);

        if (!response.ok) {
            throw new Error(`(HTTP Error) Server returned status ${response.status}.`);
        }

        const data = await response.json();
        
        if (!data.userMessage) {
            throw new Error("Received response, but it was missing the expected 'reply' field.");
        }

        return data.userMessage;

    } catch (error) {
        if (error.message.includes("Failed to fetch")) {
            throw new Error(`(Connection Error) Failed to connect to ${CHAT_API_URL}. Please check your backend server status.`);
        }
        throw error;
    }
};
// --- END API Logic ---


// --- Icon Definitions (Inline SVGs for no external dependency) ---
const UserIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 18} height={props.size || 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
);

const BotIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 18} height={props.size || 18} viewBox="0 0 24 24" fill="currentColor" stroke="none" className={props.className}>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/>
    </svg>
);

const SendIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 20} height={props.size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
        <path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
    </svg>
);
// -----------------------------------------------------------------

// Component to render individual messages
const ChatMessage = ({ message }) => {
    const isUser = message.sender === 'user';
    const baseClasses = "flex p-3 sm:p-4 my-2 max-w-[90%] md:max-w-[75%] rounded-2xl transition-all duration-300";
    
    const AvatarIcon = isUser ? UserIcon : BotIcon;

    const messageClasses = message.isError 
        ? 'bg-red-100 text-red-700 border border-red-300 rounded-tl-md shadow-md' 
        : isUser 
            ? 'bg-blue-600 text-white rounded-br-md shadow-lg font-medium' 
            : 'bg-white text-gray-800 rounded-tl-md shadow-md border border-gray-100';
    
    return (
        <div className={`flex w-full px-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
            
            {!isUser && (
                <div className="mr-3 mt-1 p-2 bg-blue-50 text-blue-600 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <AvatarIcon size={18} />
                </div>
            )}

            <div className={`${baseClasses} ${isUser ? 'ml-auto' : 'mr-auto'} ${messageClasses}`}>
                {message.text}
            </div>

            {isUser && (
                <div className="ml-3 mt-1 p-2 bg-gray-100 text-gray-700 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <AvatarIcon size={18} />
                </div>
            )}
        </div>
    );
};


// Main App Component
const App = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null); 
    const [isLoading, setIsLoading] = useState(false);

    // Auto-scroll logic
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Textarea resize logic
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'; 
            const maxHeight = 160; 
            let scrollHeight = textareaRef.current.scrollHeight;
            
            textareaRef.current.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
            textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
        }
    }, [input]);


    // Function to handle sending a message
    const handleSend = async (e) => {
        e?.preventDefault();
        const trimmedInput = input.trim();

        if (trimmedInput && !isLoading) {
            setIsLoading(true);
            
            // 1. Add the user's message immediately
            const newUserMessage = { id: Date.now(), text: trimmedInput, sender: 'user' };
            setMessages((prevMessages) => [...prevMessages, newUserMessage]);
            setInput(''); 

            try {
                // 2. CALL THE API SERVICE FUNCTION (defined above)
                const botResponseText = await sendMessageToBackend(trimmedInput);
                
                // 3. Add the bot's response message
                const newBotMessage = { id: Date.now() + 1, text: botResponseText, sender: 'bot' };
                setMessages((prevMessages) => [...prevMessages, newBotMessage]);

            } catch (error) {
                console.error("Error in handleSend:", error);
                
                // 4. Handle connection or response errors
                const errorMessage = {
                    id: Date.now() + 1,
                    text: error.message || "An unknown network error occurred.",
                    sender: 'bot', 
                    isError: true,
                };
                setMessages((prevMessages) => [...prevMessages, errorMessage]);
            } finally {
                setIsLoading(false);
            }
        }
    };


    // Custom Loading Indicator (Dot Bounce)
    const LoadingIndicator = () => (
        <div className="flex justify-start px-2">
            <div className="flex items-center space-x-2 p-3 sm:p-4 my-2 max-w-xs rounded-2xl bg-white text-gray-800 shadow-md border border-gray-100">
                <div className="flex space-x-1">
                    <span className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                    <span className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                    <span className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="h-screen bg-gray-50 flex items-start justify-center p-0 md:p-6 font-sans">
            <style>{`
                /* Custom scrollbar styling for a cleaner look */
                .chat-container::-webkit-scrollbar { width: 8px; }
                .chat-container::-webkit-scrollbar-track { background: #f1f1f1; }
                .chat-container::-webkit-scrollbar-thumb { background: #ccc; border-radius: 4px; }
                .chat-container::-webkit-scrollbar-thumb:hover { background: #999; }
                textarea { font-family: inherit; }
            `}</style>
            
            {/* Main Chat Container */}
            <div className="flex flex-col w-full max-w-4xl h-full md:h-[95vh] bg-white rounded-none md:rounded-2xl shadow-xl overflow-hidden transition-all duration-300">

                {/* Chat History Area (Scrollable) */}
                <div className="chat-container flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-gray-50">
                    {/* Initial Message */}
                    {messages.length === 0 && (
                        <div className="text-center text-gray-400 pt-10 pb-20 italic select-none">
                            <BotIcon className="mx-auto mb-3 text-blue-500" size={32} />
                            <h2 className="text-xl font-semibold text-gray-700">How can I help you today?</h2>
                            <p className="text-sm mt-1">Start typing your command or question below.</p>
                        </div>
                    )}

                    {/* Render all messages */}
                    {messages.map((msg) => (
                        <ChatMessage key={msg.id} message={msg} />
                    ))}

                    {/* Loading Indicator */}
                    {isLoading && <LoadingIndicator />}

                    {/* Spacer div for auto-scrolling */}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Form Area */}
                <div className="p-4 bg-white border-t border-gray-200">
                    <form onSubmit={handleSend} className="flex items-end w-full max-w-3xl mx-auto p-2 bg-white rounded-xl shadow-lg border border-gray-200">
                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend(); 
                                }
                            }}
                            placeholder="Ask me anything..."
                            className="flex-1 text-base p-2 text-gray-700 placeholder-gray-400 bg-transparent border-none focus:ring-0 resize-none overflow-y-hidden min-h-[24px] max-h-40 outline-none"
                            rows={1}
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            className="p-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-gray-400 transition duration-150 ease-in-out transform hover:scale-105 ml-2 flex items-center justify-center h-10 w-10 flex-shrink-0"
                            disabled={!input.trim() || isLoading}
                        >
                            <SendIcon size={20} />
                        </button>
                    </form>
                    <p className="text-xs text-center text-gray-400 mt-2 select-none">
                        Use Shift+Enter for a new line.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default App;
