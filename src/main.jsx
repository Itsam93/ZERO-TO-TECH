import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import App from './App.jsx';

// Fonts
import "@fontsource/sora/600.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
     <App />
    </BrowserRouter>
  </StrictMode>,
)