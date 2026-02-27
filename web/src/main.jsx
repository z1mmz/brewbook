import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as ChakraProvider } from "./components/ui/provider";
import { LoginContextProvider } from "./contexts/loginContext";
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LoginContextProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ChakraProvider>
            <App />
          </ChakraProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </LoginContextProvider>
  </StrictMode>,
);
