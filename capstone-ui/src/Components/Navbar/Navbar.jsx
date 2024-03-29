import * as React from 'react'
import './Navbar.css'
import { Link } from "react-router-dom"
import {useAuthNavContext} from "../../Contexts/authNav"
import { useNavigate } from 'react-router-dom'
import apiClient from "../../Services/ApiClient"
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

export default function Navbar(){
    //using tippy.js for tooltip hover message
    tippy('#login', {
        content: "Login",
        offset: [0, 20],
    });
    tippy('#register', {
        content: "Register",
        offset: [0, 20],
    });
    tippy('#logout', {
        content: "Logout",
        offset: [0, 20],
    });
    tippy('#search-icon', {
        content: "Search",
        offset: [0, 20],
    });
    tippy('#sidebar-toggle', {
        content: "Toggle sidebar",
        offset: [0, 20],
    });

    // extract the navigate function
    const navigate = useNavigate()

    //useState variable for tracking User search text.
    const [searchField, setSearchField] = React.useState('')
    const [isOpen, setIsOpen] = React.useState(false)
    const {showLoginForm, showRegisterForm, setSearchWord, setResultsType, user, setUser, setError, visibleSidebar, setVisibleSidebar} = useAuthNavContext()

    //Function that handles the value of searchField depending on the value of User's input text
    const handleSearchOnChange = (event) => {
        
        //prevent the events default behaviour
        event.preventDefault()

        //get the value of the User's search input
        const searchWord = event.target.value

        //set the value of the search input tag
        setSearchField(searchWord)
    }

    //Function that runs when the search field is submitted.
    const handleSearchOnSubmit = (event) => {
        /**
         * This codes stores the search word in a state variable called (searchWord) then navigates to the results page.
         * 
         * i.e The results page calls the api with the searchword value
         */

        event.preventDefault()

        // If the search Field is not an empty string And the search field is nothing blank space then navigate OTHERWISE do nothing
        if (searchField !== '' && searchField !== "" && searchField.trim() !== ""){
            setResultsType("searchbar")
            setSearchWord(searchField)


            /** redirect based on the searchType
             * 
             * 1) if searchType is ("") then go to recipe search page
             * 
             * 2) if searchType is ("users") then go to the user search page
             *  */
            if(searchType === ""){
                navigate('/search')
            }
            if(searchType === "users"){
                navigate('/usersearch')
            }
        }
    }

    // function for pressing enter while searching
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearchOnSubmit(event)
        }
    }

    const handleLogout = async () => {
        await apiClient.logoutUser()
        setUser({})
        setError(null)
        navigate("/")
    }

    /**  Select Searchbar state variable
     * 
     *   Can only be one of two states for now 
     * 
     *  1) ("") - default = search for recipes
     * 
     *  2) ("users") - type = search for users
    */
    const [searchType, setSearchType] = React.useState("")

    // handle the change of the select button
    const handleSearchType = (e) => {

        // prevent default behaviour
        e.preventDefault()

        //Change the search type to the option chose
        setSearchType(e.target.value)

        //set placeholder text
        if(e.target.value === "")
        setSearchPlaceholder("Search for recipe")

        if(e.target.value === "users")
        setSearchPlaceholder("Search for user")
    }

    // searchbar placeholder 
    const [searchPlaceholder, setSearchPlaceholder] = React.useState("Search for recipe")

    // toggle sidebar on click function
    const handleSidebarOnClick = () => {
        if(visibleSidebar)setVisibleSidebar(false)
        else setVisibleSidebar(true)
    }

    const handleSettingClick = () => {
        if (!isOpen) {
            document.querySelector(".settings").style.transform = "translateY(38%)";
            document.querySelector(".user-options").style.height = "100%";
            document.querySelector(".one").style.display = "flex";
            document.querySelector(".two").style.display = "flex";
            document.querySelector(".three").style.display = "flex";
            document.querySelector(".four").style.display = "flex";
            setIsOpen(true)
        } else {
            document.querySelector(".settings").style.transform = "none";
            document.querySelector(".user-options").style.height = "0";
            document.querySelector(".one").style.display = "none";
            document.querySelector(".two").style.display = "none";
            document.querySelector(".three").style.display = "none";
            document.querySelector(".four").style.display = "none";
            setIsOpen(false)
        }
    }
    
    return(
        <nav className='navbar'>
            <div className={`sidebar-toggle ${!visibleSidebar ? `closed` : `open`}`} onClick={handleSidebarOnClick}>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            <div className="logo-container">
                <Link className="nav-link" to="/">
                    <img src="https://cdn.iconscout.com/icon/free/png-256/chef-1828025-1551570.png" alt="Logo img" className='logo' />
                </Link>
            </div>
            {/* Search bar */}
            <div className="search-container">
                <select  name="searchtype" onChange={handleSearchType}>
                    <option value="">recipes</option>
                    <option value="users">users</option>
                </select>
                <input type="text" name="search" placeholder={searchPlaceholder} value={searchField} onChange={handleSearchOnChange} onSubmit={handleSearchOnSubmit} onKeyDown={handleKeyDown}/>
                        <div className="round">
                            <i id="search-icon" className="fa-solid fa-magnifying-glass" onClick={handleSearchOnSubmit}></i>
                        </div>
                </div>
            
            {/* Buttons sections, temporary icon for login and register for now */}
            <div className="nav-btns">
                    {user?.email ? null : <img id="login" src="https://img.icons8.com/ios-glyphs/344/login-rounded-right--v1.png" alt="temp icon" className='nav-btn' onClick={showLoginForm}/>}
                    {user?.email ? null : <img id="register" src="https://static.thenounproject.com/png/6478-200.png" alt="temp icon" className='nav-btn' onClick={showRegisterForm}/>}
                    {user?.email ? <div className="settings">
                        <img src={user?.imageUrl ? user.imageUrl : "https://toppng.com/uploads/preview/circled-user-icon-user-pro-icon-11553397069rpnu1bqqup.png"} alt='profile img' className='nav-btn profile-nav' onClick={handleSettingClick}/>
                        <div className="user-options">
                            <Link to="/profile">
                                <div className="option one" onClick={handleSettingClick}>Profile</div>
                            </Link>
                            <Link to="/recipe/create">
                                <div className="option two" onClick={handleSettingClick}>Add Recipe</div>    
                            </Link>
                            <Link to="/mealplanner">
                                <div className="option three" onClick={handleSettingClick}>Meal Plan</div>
                            </Link>
                            <div className="option four" onClick={handleLogout}>Logout</div>
                        </div>
                    </div> : null}

            </div>
            
        </nav>
    )
}