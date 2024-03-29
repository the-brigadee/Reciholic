import './App.css';
import * as React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom" 
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import LandingPage from '../LandingPage/LandingPage';
import NotFound from '../NotFound/NotFound';
import {AuthNavContextProvider, useAuthNavContext} from '../../Contexts/authNav'
import ResultPage from '../ResultPage/ResultPage'
import RecipeDetail from '../RecipeDetail/RecipeDetail';
import UserProfilePage from '../UserProfilePage/UserProfilePage';
import RecipeAdd from '../RecipeAddPage/RecipeAdd';
import UserSearchPage from '../UserSearchPage/UserSearchPage';
import UserDetailPage from '../UserDetailPage/UserDetailPage';
import MealPlanner from '../MealPlanner/MealPlanner';
import apiClient from '../../Services/ApiClient';
import FollowPage from '../FollowPage/FollowPage';
import AboutUs from '../AboutUs/AboutUs';


export default function AppContainer(){
  return(
    <AuthNavContextProvider>
      <App />
    </AuthNavContextProvider>
  )
}



/**
 * 
 * @returns App function
 */

function App() {

  const {setUser, setIsLoading, setError, setUserDetails, setVisibleSidebar} = useAuthNavContext()

  React.useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await apiClient.fetchUserFromToken()
      if (error?.response?.data?.error?.status !== 304) {
        setError((e) => ({ ...e, user: error }))
      }
      if (data?.user) {
        setUser(data.user)
        setUserDetails(data.details)
        setError((e) => ({ ...e, user: null }))
      }
    }

    const token = localStorage.getItem("reciholic_token")
    if (token) {
      apiClient.setToken(token)
      setIsLoading(true)
      setError(null)
      fetchUser()
    }

    setIsLoading(false)
  }, [setUser, setIsLoading, setError])
  //return statement
  return (
    <div className="App">
        <BrowserRouter>
          <Navbar/>
          <div className='app-body' >
            <Sidebar />
          {/* Create React routers for page navigation. */}
            <Routes>
              {/* Declare individual routes under */}
              <Route path='/' element={<LandingPage/>} />
              <Route path='/search' element={<ResultPage />}/>
              <Route path='/usersearch' element={<UserSearchPage />}/>
              <Route path='/recipe/:recipeId' element={<RecipeDetail />}/>
              <Route path='/recipe/create' element={<RecipeAdd />}/>
              <Route path='/profile' element={<UserProfilePage />}/>
              <Route path='/profile/:profileId' element={<UserDetailPage />}/>
              <Route path='/mealplanner' element={<MealPlanner />}/>
              <Route path='/profile/:profileId/:followType' element={<FollowPage />} />
              <Route path='/about' element={<AboutUs />} />
              <Route path='*' element={<NotFound />}/>
            </Routes>

            
          </div>
        </BrowserRouter>
        
    </div>
  );
}
