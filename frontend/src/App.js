import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import ChatAppRC from "./ChatAppRC/ChatAppRC";

const App = () => {
  return (
    <ChakraProvider>
      <ChatAppRC />
    </ChakraProvider>
  );
};

export default App;
