import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'

// Redux 
import { useSelector } from 'react-redux'

// Pages 
import Gallery from './pages/Gallery'
import Auth from './pages/Auth'
import Profile from './pages/Profile'

// Components 
import PageContainer from './components/page-container';
import NavBar from './components/navbar';

// Lib 
import PrivateRoutes from './lib/PrivateRoutes';

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
