import React from 'react';
import NavigationLayout from './components/NavigationLayout';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className="h-screen flex flex-col">
      <NavigationLayout />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}

export default App;