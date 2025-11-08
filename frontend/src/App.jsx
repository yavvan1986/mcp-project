import React, { useState, useRef, useEffect } from 'react';

// Main App Component
const App = () => {

  // State to hold the chat history (an array of message objects)
  const [messages, setMessages] = useState([]);
  // State to hold the current input text
  const [input, setInput] = useState('');
  
  // Ref to automatically scroll the chat area to the bottom
  const messagesEndRef = useRef(null);
  // Ref for auto-resizing textarea
  const textareaRef = useRef(null); 
  // State for loading indicator
  const [isLoading, setIsLoading] = useState(false);

  // Auto-scroll function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Effect to scroll to the bottom whenever a new message is added
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Effect to automatically resize the textarea height
  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to correctly calculate the new scrollHeight
      textareaRef.current.style.height = 'auto'; 
      // Set the height to fit the content, capped by CSS max-height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  // Function to handle sending a message
  const handleSend = (e) => {
    console.log("e= "+e);
    // Check if the event object exists before calling preventDefault
    if (e) {
      e.preventDefault();
    }
    
    const trimmedInput = input.trim();

    if (trimmedInput && !isLoading) {
      setIsLoading(true);
      // 1. Add the user's message
      const newUserMessage = {
        id: Date.now(),
        text: trimmedInput,
        sender: 'user',
      };
      setMessages((prevMessages) => [...prevMessages, newUserMessage]);
      setInput(''); // Clear the input field

      // 2. Simulate a bot response after a short delay
      setTimeout(() => {
        const newBotMessage = {
          id: Date.now() + 1,
          text: "I see you said: " + trimmedInput + ". I am ready for your next command!",
          sender: 'bot',
        };
        setMessages((prevMessages) => [...prevMessages, newBotMessage]);
        setIsLoading(false);
      }, 1000);
    }
  };

  // Component to render individual messages
  const ChatMessage = ({ message }) => {
    // console.log("sender= " + message.sender);
    const isUser = message.sender === 'user';
    const baseClasses = "flex p-3 my-2 max-w-[80%] rounded-xl shadow-md transition-all duration-300";
    
    // Inline SVG for User Icon (Simple Circle)
    const UserIcon = (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    );

    // Inline SVG for Bot Icon (Simple Gear/Cog)
    const BotIcon = (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 5v2"/><path d="M12 17v2"/><path d="m8.5 8.5 1 1"/><path d="m14.5 14.5 1 1"/><path d="m15.5 8.5-1 1"/><path d="m9.5 14.5-1 1"/>
      </svg>
    );

    return (
      <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
        {/* Avatar/Icon for Bot */}

        {/* {!isUser && (
          <div className="mr-3 p-2 bg-blue-100 text-blue-700 rounded-full h-10 w-10 flex items-center justify-center">
            {BotIcon}
          </div>
        )} */}

        {/* Message Bubble */}
        <div className={`
          ${baseClasses} 
          ${isUser 
            ? 'bg-blue-600 text-white rounded-br-none ml-auto' 
            : 'bg-gray-100 text-gray-800 rounded-tl-none mr-auto'
          }
        `}>
          {message.text}
        </div>

        {/* Avatar/Icon for User */}
        {isUser ? (
          <div className="ml-3 p-2 bg-green-100 text-green-700 rounded-full h-10 w-10 flex items-center justify-center">
            {UserIcon}
          </div>
          ) : (
          <div className="mr-3 p-2 bg-blue-100 text-blue-700 rounded-full h-10 w-10 flex items-center justify-center">
            {BotIcon}
          </div>
          )
        }
      </div>
    );
  };

  // Inline SVG for Send Icon
  const SendIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
    </svg>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center p-4 sm:p-6 font-sans">
      <div className="flex flex-col w-full max-w-4xl h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Chat History Area */}
        <div className="flex-1 p-4 sm:p-8 overflow-y-auto space-y-4">
          {/* Initial Message */}
          {messages.length === 0 && (
            <div className="text-center text-gray-500 pt-10 italic">
              Start chatting below! Your messages will appear here.
            </div>
          )}

          {/* Render all messages */}
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-2 p-3 my-2 max-w-xs rounded-xl bg-gray-100 text-gray-800 shadow-md">
                <div className="flex space-x-1">
                  <span className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                  <span className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                  <span className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                </div>
                <span>Bot is typing...</span>
              </div>
            </div>
          )}

          {/* Spacer div for auto-scrolling */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form Area */}
        <div className="p-4 bg-gray-100 border-t border-gray-200">
          <form onSubmit={handleSend} className="flex items-end space-x-3">
            <textarea
              ref={textareaRef} // Ref attached for resizing
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { // Allows Enter to send, Shift+Enter for new line
                if (e.key === 'Enter' && !e.shiftKey) {
                  console.log("pressed key "+e.key);
                  e.preventDefault();
                  handleSend(e); // Call handleSend without passing the event, as it's modified to handle it
                }
              }}
              placeholder="Type your message here..."
              // Updated classes for a bigger, self-resizing input box:
              // min-h-[50px] for minimum height, max-h-48 for max height, resize-none and overflow-y-hidden
              className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-gray-700 shadow-inner resize-none overflow-y-hidden min-h-[50px] max-h-48 transition-all duration-150 ease-in-out"
              rows={1}
              disabled={isLoading}
            />
            <button
              type="submit"
              className="p-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-gray-400 transition duration-150 ease-in-out transform hover:scale-105"
              disabled={!input.trim() || isLoading}
            >
              {SendIcon}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default App;
