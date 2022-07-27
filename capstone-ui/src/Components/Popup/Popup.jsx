import * as React from 'react'
import './Popup.css'
import {useAuthNavContext} from "../../Contexts/authNav"
import apiClient from "../../Services/ApiClient"
import { useNavigate } from 'react-router-dom'

export default function Popup(){
    //needed functions from useAuthNavContext
    const {popupType, closePopup, showRegisterForm, showLoginForm, error, setError, setUser, isLoading, setIsLoading, user, isPwChanged, setIsPwChanged, setMealPlan, getMealPlan} = useAuthNavContext()
    const [form, setForm] = React.useState({
        email: "",
        password: "",
        confirm_password: "",
        username: "",
        dob: "",
        last_name: "",
        first_name: "",

    })
    //Form made specifically for meal planner
    const [formPlan, setFormPlan] = React.useState({
        recipe_id: '',
        day: 'Sunday',
        user_id: '',
    })

    const navigate = useNavigate()

    //Function that handles the value of form for login/signup
    const handleOnFormInputChange = (event) => {
        //prevent the events default behaviour  
        event.preventDefault()

        //error checking
        if (event.target.name === "email") {
            if (event.target.value.indexOf("@") < 1) {
                setError((e) => ({ ...e, email: "Please enter a valid email." }))
            } else {
                setError((e) => ({ ...e, email: null }))
            }
        }
        if (event.target.name === "password" && popupType === "Register") {
            if (event.target.value !== form.confirm_password) {
                setError((e) => ({ ...e, confirm_password: "Password do not match." }))
            } else {
                setError((e) => ({ ...e, confirm_password: null }))
            }
        }
        if (event.target.name === "confirm_password" && popupType === "Register") {
            if (event.target.value !== form.password) {
                setError((e) => ({ ...e, confirm_password: "Password do not match." }))
            } else {
                setError((e) => ({ ...e, confirm_password: null }))
            }
        }
        //set the value of the form

        setForm((f) => ({ ...f, [event.target.name]: event.target.value }))
    }
    //Function that handles the value of form for mealplanner form
    const handleOnFormInputChangeMealPlanner = (event) => {
        //prevent the events default behaviour  
        event.preventDefault()
        
        setFormPlan((f) => ({ ...f, [event.target.name]: event.target.value }))
    }

    //signup/signin/mealplanner function
    const handleOnSubmit = async () => {
        setIsLoading(true)
        setError((e) => ({ ...e, form: null }))
        setError((e) => ({ ...e, email: null }))
        setError((e) => ({ ...e, confirm_password: null }))
        
        if ((form.password_confirm === "" || form.password !== form.confirm_password) && popupType === "Register") {
            return
        }

        var dataUse, errorUse
        if (popupType === "Register") {
            const {data, error} = await apiClient.signupUser({
                firstName: form.first_name,
                lastName: form.last_name,
                email: form.email,
                dob: form.dob,
                password: form.password,
                userName: form.username
            })
            dataUse = data
            errorUse = error
        } else if (popupType === "Login") {
            const {data, error} = await apiClient.loginUser({
                email: form.email,
                password: form.password
            })
            dataUse = data
            errorUse = error
        }else if (popupType === "MealPlanner") {
            const {data, error} = await apiClient.createMealPlan({
                recipe_id: formPlan.recipe_id,
                weekday: formPlan.day,
                user_id: user?.id
            })
            dataUse = data
            errorUse = error
            
        }
                
        if (errorUse) {
            setError((e) => ({ ...e, form: errorUse }))
            setIsLoading(false)
            return
            }
        if (dataUse?.user) {
            apiClient.setToken(dataUse.token)
            setUser(dataUse?.user)
            setIsPwChanged(false)
        }
        setIsLoading(false)
        if(popupType!=="MealPlanner"){
            navigate("/")
        }else if(popupType==="MealPlanner"){
            //Going to be used for the Meal Planner Page to close the popup and update the mealplanner
            closePopup();
            getMealPlan();
        }
        
    }

    //useEffect to close the popup form when user are logged in
    React.useEffect(() => {
        if (user?.email && popupType!=="MealPlanner") {
            closePopup()
        }
    })

    var formHTML
    //creating the popup form based on the type
    if (popupType === "Login") {
        formHTML = 
        <div className="form">
            <div className="input-field">
                <label htmlFor="Email">Email</label>
                <input type="email" name="email" placeholder="user@gmail.com"  onChange={handleOnFormInputChange}/>
            </div>
            <div className="input-field">
                <label htmlFor="Password">Password</label>
                <input type="password" name="password" placeholder="password"  onChange={handleOnFormInputChange}/>
            </div>
            <div className="footer">
                <p>Don't have an account? <br/> Sign up&nbsp;
                    <span className='here-btn' onClick={(e) => {e.stopPropagation();setError((e) => ({ ...e, form: null }));setError((e) => ({ ...e, email: null }));showRegisterForm(); }}>here</span>.
                </p>
                <button className="footer-btn" disabled={isLoading} onClick={handleOnSubmit}>
                    {isLoading ? "Loading..." : "SIGNIN"}
                </button>
            </div>
        </div>
    } else if (popupType === "Register") {
        formHTML = 
        <div className="form">
            <div className="input-field split">
                <div className="input-row">
                    <label htmlFor="First Name">First Name</label>
                    <input type="text" name="first_name" placeholder="first"  onChange={handleOnFormInputChange}/>
                </div>
                <div className="input-row">
                    <label htmlFor="Last Name">Last Name</label>
                    <input type="text" name="last_name" placeholder="last"  onChange={handleOnFormInputChange}/>
                </div>
            </div>
            <div className="input-field split">
                <div className="input-row">
                    <label htmlFor="username">Username</label>
                    <input type="text" name="username" placeholder="username"  onChange={handleOnFormInputChange}/>
                </div>
                <div className="input-row">
                    <label htmlFor="DOB">DOB</label>
                    <input type="date" name="dob" className='calendar' onChange={handleOnFormInputChange}/>
                </div>

            </div>
            <div className="input-field">
                <label htmlFor="Email">Email</label>
                <input type="email" name="email" placeholder="user@gmail.com"  onChange={handleOnFormInputChange}/>
            </div>
            <div className="input-field">
                <label htmlFor="Password">Password</label>
                <input type="password" name="password" placeholder="password" onChange={handleOnFormInputChange}/>
            </div>
            <div className="input-field">
                <label htmlFor="Confirm Password">Confirm Password</label>
                <input type="password" name="confirm_password" placeholder="password" onChange={handleOnFormInputChange}/>
            </div>
            {(error?.confirm_password !== null && form.confirm_password !== "")  ? <span className="error">Password do not match.</span> : null}
            <div className="footer">
                <p>Already have an account? <br/> Sign in&nbsp;
                    <span className='here-btn' onClick={(e) => {e.stopPropagation();setError((e) => ({ ...e, form: null }));setError((e) => ({ ...e, email: null }));showLoginForm(); }}>here</span>.
                </p>
                <button className="footer-btn" disabled={isLoading} onClick={handleOnSubmit}>
                    {isLoading ? "Loading..." : "SIGNUP"}
                </button>
            </div>
        </div>
    }else if(popupType==="MealPlanner"){
        formHTML = 
        <div className="form">
            <div className="input-field">
                <label htmlFor="RecipeID">Recipe's ID</label>
                <input type="number" name="recipe_id" onChange={handleOnFormInputChangeMealPlanner}/>
            </div>
            <div className="input-field">
                <label htmlFor="Password">Day of week</label>
                <select id="day" name="day" onChange={handleOnFormInputChangeMealPlanner}>
                    <option name="day" disabled={true}>--Select your option--</option>
                    <option name="day">Sunday</option>
                    <option name="day">Monday</option>
                    <option name="day">Tuesday</option>
                    <option name="day">Wednesday</option>
                    <option name="day">Thursday</option>
                    <option name="day">Friday</option>
                    <option name="day">Saturday</option>
                </select>
            </div>
            <div className="footer">
                <button className="footer-btn" disabled={isLoading} onClick={handleOnSubmit}>
                    {isLoading ? "Loading..." : "ADD"}
                </button>
            </div>
        </div>
    }

    return(
        <div className="popup-container" >
            <div className={`popup-card ${popupType.toLowerCase()}`} onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={(e) => {e.stopPropagation();closePopup();}}>&times;</button>
                <h1>{popupType}</h1>
                {isPwChanged ? <span className="error">Please login with your new password.</span> : null}
                {(error?.form) ? <span className="error">{error?.form}</span> : null}
                {(error?.email !== null && form.email !== "") ? <span className="error">Please enter a valid email.</span> : null}
                {formHTML}
            </div>
        </div>
    )
}