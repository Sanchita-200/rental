import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/common/Navbar';
import { SplashScreen } from './components/common/SplashScreen';
import { AppRoutes } from './routes/AppRoutes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col bg-[#07140F] text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
              
              {/* Splash Screen Animation on Initial Launch */}
              {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} autoDismissMs={2200} />}

              <Navbar />
              
              <main className="flex-1">
                <AppRoutes />
              </main>

            </div>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
