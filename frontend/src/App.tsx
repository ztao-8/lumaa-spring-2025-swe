import React, { useState } from 'react';
import Login from './components/login';
import Register from './components/Register';
import Tasks from './components/Tasks';

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <div>
      <header>
        <h1>Task Manager</h1>
        {token ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <>
            <span>Please login or register</span>
          </>
        )}
      </header>
      <main>
        {token ? (
          <Tasks token={token} />
        ) : (
          <>
            <Login setToken={setToken} />
            <hr />
            <Register />
          </>
        )}
      </main>
    </div>
  );
};

export default App;

