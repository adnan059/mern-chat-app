import React from "react";
import "./ChatAppRC.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import HomePage from "./pages/HomePage";
import ChatProvider from "./context/ChatProvider";

const ChatAppRC = () => {
  return (
    <>
      <div className="chatAppRc">
        <BrowserRouter>
          <ChatProvider>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/chats" element={<ChatPage />} />
            </Routes>
          </ChatProvider>
        </BrowserRouter>
      </div>
    </>
  );
};

export default ChatAppRC;
