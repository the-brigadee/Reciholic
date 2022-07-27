import * as React from 'react'
import Slider from "react-slick";
import './UserProfilePage.css'
import RecipeCard from '../RecipeCard/RecipeCard';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {useAuthNavContext} from "../../Contexts/authNav"
import apiClient from "../../Services/ApiClient"
import Overlay from '../Overlay/Overlay'
import { useNavigate } from 'react-router-dom';
import DragDropFile from '../DragDrop/DragDrop';


export default function UserProfilePage() {
  // setting for npm react slick library
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 1575,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 1050,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 850,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  const navigate = useNavigate()

  const {user, setError, setIsLoading, isLoading, error, userDetails, file, setUser, setFile} = useAuthNavContext()
  const [createdRecipes, setCreatedRecipes] = React.useState([])
  const [savedRecipes, setSavedRecipes] = React.useState([])
  // useState for showing the buttons
  const [isEditing, setIsEditing] = React.useState(false)
  // useState for each display type
  const [infoDisplay, setInfoDisplay] = React.useState("profile")

  //useState for displaying saved or created recipe
  const [recipesDisplay, setRecipesDisplay] = React.useState("Created")

  const [form, setForm] = React.useState({
    first_name: user.first_name,
    last_name: user.last_name,
    username: user.username,
    dob: user.dob,
    bio: user.description,
    old_password: "",
    new_password: "",
    confirm_password: "",
  })

  // useState for when the user is updating their profile img
  const [isChangingImg, setIsChangingImg] = React.useState(false)

  React.useEffect(()=>{
    
    const getSavedRecipes = async () => {
      const {data, error} = await apiClient.getUsersSavedRecipes()
            if (error) setError((e) => ({ ...e, savedRecipe: error }))
            if (data?.savedrecipe) {
                setSavedRecipes(data.savedrecipe)
            }
    }

    const getCreatedRecipes = async () => {
      const {data, error} = await apiClient.getUserCreatedRecipes()
            if (error) setError((e) => ({ ...e, createdRecipe: error }))
            if (data?.recipe) {
                setCreatedRecipes(data.recipe)
            }
    }

    getSavedRecipes()
    getCreatedRecipes()
  }, [setSavedRecipes, setCreatedRecipes])

    //Function that handles the value of form for updating user profile
    const handleOnFormInputChange = (event) => {
      //prevent the events default behaviour  
      event.preventDefault()
  
      //error checking
      if (event.target.name === "new_password") {
          if (event.target.value !== form.confirm_password) {
              setError((e) => ({ ...e, pwChange_confirm: "Password do not match." }))
          } else {
              setError((e) => ({ ...e, pwChange_confirm: null }))
          }
      }
      if (event.target.name === "confirm_password") {
          if (event.target.value !== form.new_password) {
              setError((e) => ({ ...e, pwChange_confirm: "Password do not match." }))
          } else {
              setError((e) => ({ ...e, pwChange_confirm: null }))
          }
      }
      //set the value of the form
  
      setForm((f) => ({ ...f, [event.target.name]: event.target.value }))
      
  }

  // logout function
  const handleLogout = async () => {
    await apiClient.logoutUser()
    setUser({})
    setError(null)
    navigate("/", {state: true})
}

  // function and make call to the backend to update user profile
  const handleOnSave = async () => {
        if ((form.password_confirm === "" || form.new_password !== form.confirm_password) && infoDisplay === "password") {
          return
        }
        setError((e) => ({ ...e, profile: null }))
        setError((e) => ({ ...e, passwordUpdate: null }))
        
        if (infoDisplay === "form") {
          
          const {data, error} = await apiClient.updateProfile({
              first_name: form.first_name,
              last_name: form.last_name,
              dob: form.dob,
              username: form.username,
              user_id: user.id,
              description: form.bio
          })
          if (error) {
            setError((e) => ({ ...e, profile: error }))
            setIsLoading(false)
            return
            }
          if (data?.user) {
            console.log(data?.user)
              setUser(data?.user)
              setIsEditing(false)
              setInfoDisplay("profile")
          }
        } else if (infoDisplay === "password") {
          if (form.old_password === "" || form.new_password === "") {
            setError((e) => ({ ...e, passwordUpdate: "Please fill in all of the fields!" }))
            return
          }
          const {data, error} = await apiClient.updatePassword({
              old_password: form.old_password,
              new_password: form.new_password,
              user_id: user.id
          })
          if (error) {
            setError((e) => ({ ...e, passwordUpdate: error }))
            setIsLoading(false)
            return
            }
          if (data?.user) {
            handleLogout()
          }
        }
  }

  const handleOnCancel = async () => {
        setError((e) => ({ ...e, profile: null }))
        setError((e) => ({ ...e, passwordUpdate: null }))
        setIsEditing(false)
        setInfoDisplay("profile")
  }

  // the editing profile form, show when user click on edit profile button
  const editForm = (<div className="form">
  <div className="input-field split">
      <div className="input-row">
          <label htmlFor="First Name">First Name</label>
          <input type="text" name="first_name" placeholder={user.first_name}  onChange={handleOnFormInputChange}/>
      </div>
      <div className="input-row">
          <label htmlFor="Last Name">Last Name</label>
          <input type="text" name="last_name" placeholder={user.last_name} onChange={handleOnFormInputChange}/>
      </div>
  </div>
  <div className="input-field split">
      <div className="input-row">
          <label htmlFor="username">Username</label>
          <input type="text" name="username" placeholder={user.username} onChange={handleOnFormInputChange}/>
      </div>
      <div className="input-row">
          <label htmlFor="DOB">DOB</label>
          <input type="date" name="dob" className='calendar' placeholder={user.dob} onChange={handleOnFormInputChange}/>
      </div>
  </div>
  <div className="input-row">
    <label htmlFor="bio">Bio</label>
    <textarea name="bio" rows="8" placeholder={user.bio} onChange={handleOnFormInputChange}>
    </textarea>
  </div>
                </div>)

  // user's profile details, this is what the user see when they go to the user profile page
  const userProfile = (<div className="user-display">
                        <div className="user-facts">
                          <h1>{`${user?.first_name} ${user?.last_name}`}</h1>
                          <h4>Joined on {user?.created_at?.split("T")[0]}</h4>
                          <span>{user?.bio}</span>
                          <span>Birthday: {user?.dob?.split("T")[0]}</span>
                        </div>
                      </div>)
  
  // change password form
  const changePassword = (<div className="change-password">
                            <div className="input-row">
                              <label htmlFor="old_password">Old Password</label>
                              <input type="password" name="old_password" placeholder="old password" onChange={handleOnFormInputChange}/>
                            </div>
                            <div className="input-row">
                                <label htmlFor="New Password">New Password</label>
                                <input type="password" name="new_password" placeholder="new password" onChange={handleOnFormInputChange}/>
                            </div>
                            <div className="input-row">
                                <label htmlFor="Confirm Password">Confirm Password</label>
                                <input type="password" name="confirm_password" placeholder="new password" onChange={handleOnFormInputChange}/>
                              {error?.pwChange_confirm ? <span className="error">{error.pwChange_confirm}</span> : null}

                            </div>
                              {error?.passwordUpdate ? <span className="error">{error.passwordUpdate}</span> : null}
                              {error?.profile ? <span className="error">{error.profile}</span> : null}
                          </div>)

  var elToDisplay
  if (infoDisplay === "profile") {
    elToDisplay = userProfile
  } else if (infoDisplay === "form") {
    elToDisplay = editForm
  } else if (infoDisplay === "password") {
    elToDisplay = changePassword
  }


  //function that handles when the setting buttons are clicked
  const handleOnBtnClick = (e) => {
    if (e.target.id === "password") {
      setIsEditing(true)
      setInfoDisplay("password")
    } else if (e.target.id === "form") {
      setIsEditing(true)
      setInfoDisplay("form")
    } else if (e.target.id === "save") {
      handleOnSave()
    }
  }



  //function for update picture button onclick 
  const handleUpdateImg = async () => {
    if (isChangingImg && file?.file && file?.fileByteA) {
      const {data, error} = await apiClient.updateProfile({
          image_file: file?.fileByteA,
          user_id: user.id,
      })
      if (error) {
        setError((e) => ({ ...e, profile: error }))
        setIsLoading(false)
        return
        }
      if (data?.user) {
        setUser(data.user)
      }
      setFile({})
    }
    setIsChangingImg((e) => !e)
  }
  return (
    <div className='user-profile-container'>
        <div className="user-profile">
          <div className="left-profile">
            <div className="profile-img">
              {user?.imageUrl ? <img src={user.imageUrl} alt='profile img' /> : <img src="https://cdn.icon-icons.com/icons2/933/PNG/512/round-account-button-with-user-inside_icon-icons.com_72596.png" alt='profile img' /> }
            </div>
            { isChangingImg ? <DragDropFile /> : null }
            <button className="change-img" onClick={handleUpdateImg}>
              {isChangingImg ? "Save": "Update Picture"}
            </button>
            <div className="user-data">
              <h3>{user.username}</h3>
              <span>{userDetails?.total_recipe ? userDetails.total_recipe : 0} recipe created</span>
              <span>{userDetails?.num_following ? userDetails.num_following : 0} following</span>
              <span>{userDetails?.num_followers ? userDetails.num_followers : 0} followers</span>
            </div>
          </div>
          <div className="right-profile">
              {elToDisplay}
            <div className="setting-btns">
                {isEditing ? null :<button id="password" onClick={handleOnBtnClick}>Change Password</button>}
                {isEditing ? null : <button id="form" onClick={handleOnBtnClick}>Edit Profile</button>}
                {isEditing ? <button id="save" onClick={handleOnBtnClick}>Save</button> : null}
                {isEditing ? <button id="cancel" onClick={handleOnCancel}>Cancel</button> : null}
            </div>
          </div>
        </div>
        <div className="saved-carousel carousel">
        <select className="display-dropdown" onChange={(e) => {setRecipesDisplay(e.target.value?.split(" ")[0]);}}>
          <option name="Created">Created Recipes</option>
          <option name="Saved">Saved Recipes</option>
        </select>
          <Slider {...settings}>
                {recipesDisplay === "Saved" ? (savedRecipes?.map((recipe) => (
                    <RecipeCard recipe_url={recipe.image_url} title={recipe.name} calories={recipe.calories} category={recipe.category} recipe_id={recipe.recipe_id} key={recipe.recipe_id} ownername={recipe.ownername} owner_url={recipe.owner_url ? recipe.owner_url : "https://cdn.icon-icons.com/icons2/933/PNG/512/round-account-button-with-user-inside_icon-icons.com_72596.png"} owner_id={recipe.ownder_id}/>
                ))) : (createdRecipes?.map((recipe) => (
                  <RecipeCard recipe_url={recipe.image_url} title={recipe.name} calories={recipe.calories} category={recipe.category} recipe_id={recipe.id} key={recipe.id} ownername={user.username} owner_url={user.imageUrl ? user.imageUrl : "https://cdn.icon-icons.com/icons2/933/PNG/512/round-account-button-with-user-inside_icon-icons.com_72596.png"} owner_id={recipe.ownder_id}/>
              )))}
                {(recipesDisplay === "Saved" && !savedRecipes.length) || (recipesDisplay === "Created" && !createdRecipes.length) ? <h2>No Recipes {recipesDisplay} Yet!</h2> : null}
          </Slider>
        </div>
        <Overlay />
    </div>
  )
}