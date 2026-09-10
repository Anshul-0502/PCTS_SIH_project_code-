import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './store/AuthContext';
import { LanguageProvider } from './store/LanguageContext';
import { NotificationProvider } from './store/NotificationContext';
import { AppRoutes } from './routes/AppRoutes';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <NotificationProvider>
            <AppRoutes />
          </NotificationProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
};

export default App;
