import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'

// Redux 
import { useSelector } from 'react-redux'

// Pages 
import Gallery from './pages/gallery/gallery'
import Auth from './pages/authentication/auth'
import Profile from './pages/profile/profile'

// Components 
import PageContainer from './components/page-container.tsx';
import NavBar from './components/navbar';

// Lib 
import PrivateRoutes from './lib/private-routes';

const App = () => {
  const {isAuthenticated} = useSelector((store) => store.authentication)
  
  return (
      <>
        <BrowserRouter>
          <NavBar />
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
  );
}

export default App;
