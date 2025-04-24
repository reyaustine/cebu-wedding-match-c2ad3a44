
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './App.css'

// Mobile app gesture support (passive event listeners)
import 'default-passive-events'

// Initialize the app
createRoot(document.getElementById("root")!).render(<App />);
