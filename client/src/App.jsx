import {BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { useState } from 'react';

// Pages 
import Gallery from './pages/Gallery'
import Auth from './pages/Auth'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

// Components 
import PageContainer from './components/page-container';
import NavBar from './components/navbar';

// Lib 
import PrivateRoutes from './lib/PrivateRoutes';
import AppContext from './lib/app-context'; 

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null) 

  const handleLogIn = (result) => {
    const {user, token } = result;
    window.localStorage.setItem('react-context-jwt', token);
    setUser(user)
    setIsAuthenticated(true)
  }

  const handleLogOut = () => {
    window.localStorage.removeItem('react-context-jwt');
    setUser(null)
    setIsAuthenticated(false)
  }

  const contextValue = { user, handleLogIn, handleLogOut}
  
  return (
    <AppContext.Provider value={contextValue} >
      <>
        <BrowserRouter>
          <NavBar isAuthenticated={isAuthenticated}/>
            <PageContainer>
              <Routes>
                <Route 
                  path='/login' 
                  element={isAuthenticated ? <Navigate to="/my-profile" /> : <Auth />} 
                  exact />
                <Route 
                  path='/sign-up' 
                  element={isAuthenticated ? <Navigate to="/my-profile" /> : <Auth />} 
                  exact />
                <Route element={<PrivateRoutes isAuthenticated={isAuthenticated} />}>
                  <Route path='/' element={<Gallery />} exact />
                  <Route path='/gallery' element={<Gallery />} exact />
                  <Route path='/my-profile' element={<Profile />} exact />
                  <Route path='/edit-profile' element={<Profile />} exact />
                  <Route path='/user/:userId' element={<Profile />} />
                </Route>
                <Route path='*' element={isAuthenticated ? <Navigate to="/gallery" /> : <Auth />}  />
              </Routes>    
            </PageContainer>
        </BrowserRouter>
      </>
    </AppContext.Provider>
  );
}

export default App;
