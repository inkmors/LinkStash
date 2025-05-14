import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import App from './App'
import { Toaster } from 'sonner'

const GA_ID = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID;

if (GA_ID) {
  const script1 = document.createElement('script');
  script1.setAttribute('async', '');
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script1);

  script1.onload = () => {
    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_ID}', {
        send_page_view: true
      });
    `;
    document.head.appendChild(script2);
  } 
}

createRoot(document.getElementById('root')).render(
  
  <StrictMode>
    <App />
    <Toaster richColors position="top-right" />
  </StrictMode>,
)
