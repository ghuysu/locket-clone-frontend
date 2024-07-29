import { useState, useEffect } from 'react';
import './App.css';
import Auth from './pages/Auth';
import MainPage from './pages/MainPage';
import Cookies from 'js-cookie';

function App() {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [signInKey, setSignInKey] = useState(Cookies.get('signInKey') || '');
  const [expiryDay, setExpiryDay] = useState(Cookies.get('expiryDay') || '');

  useEffect(() => {
    const userCookie = Cookies.get('user');
    if (userCookie) {
      try {
        setUser(JSON.parse(userCookie));
      } catch (error) {
        console.error('Failed to parse user data from cookie:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (signInKey) {
      Cookies.set('signInKey', signInKey, { expires: new Date(expiryDay), secure: true, sameSite: 'Strict' });
    } else {
      Cookies.remove('signInKey');
    }
  }, [signInKey]);

  useEffect(() => {
    if (expiryDay) {
      Cookies.set('expiryDay', expiryDay, { expires: new Date(expiryDay), secure: true, sameSite: 'Strict' });
    } else {
      Cookies.remove('expiryDay');
    }
  }, [expiryDay]);

  useEffect(() => {
    if (user) {
      Cookies.set('user', JSON.stringify(user), { expires: new Date(expiryDay), secure: true, sameSite: 'Strict' });
    } else {
      Cookies.remove('user');
    }
  }, [user]);

  const signoutHandler = async () => {
    try {
      await fetch('https://skn7vgp9-9876.asse.devtunnels.ms/access/sign-out', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': 'ABC-XYZ-WWW',
          'authorization': signInKey,
          'user-id': user?._id
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      Cookies.remove('user');
      Cookies.remove('signInKey');
      Cookies.remove('expiryDay');
      setSignInKey('');
      setExpiryDay('');
      setUser(null);
      setAuth(false);
    }
  };

  useEffect(() => {
    const checkAuth = () => {
      const currentExpiryDay = Cookies.get('expiryDay');
      if (currentExpiryDay) {
        const expiryDate = new Date(currentExpiryDay);
        if (Date.now() > expiryDate.getTime()) {
          signoutHandler();
        } else {
          setAuth(true);
        }
      } else {
        setAuth(false);
      }
    };

    checkAuth();
  }, [signInKey, expiryDay]);

  return (
    <div>
      {auth ? 
        <MainPage user={user} setUser={setUser} signInKey={signInKey} signoutHandler={signoutHandler}/> :
        <Auth setUser={setUser} setSignInKey={setSignInKey} setExpiryDay={setExpiryDay}/>} 
    </div>
  );
}

export default App;
