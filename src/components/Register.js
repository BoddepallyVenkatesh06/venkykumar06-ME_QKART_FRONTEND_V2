import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";
import { useHistory } from "react-router-dom";
import {Link} from "react-router-dom";

const Register = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [username,updateUserName]=useState("");
  const [password,updatePassword]=useState("");
  const [confirmPassword,updateConfirmPasswrod]=useState("");
  const [loader,updateLoader]=useState(false);
  const history=useHistory();

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
  const register = async (formData) => {
    updateLoader(true)

    let url=config.endpoint;
    console.log(url)
     try{
      let request = await axios.post(`${url}/auth/register`,{
        "username": formData.username,
        "password": formData.password
        })
        console.log(request.data)
        updateLoader(false)
      enqueueSnackbar("Registered successfully",{ variant: 'success' })
      
      history.push("/login")
      
    }
    catch(e){

          axios.post(`${url}/auth/register`,{
            "username":formData.username,
            "password": formData.password
              }).catch((e)=>{
                if(e.response){
                  enqueueSnackbar(e.response.data.message,{ variant: 'error' })
                }
                else {
                  // Something happened in setting up the request that triggered an Error
                  enqueueSnackbar("Something went wrong. Check that the backend is running, reachable and returns valid JSON.",{ variant: 'error' })
                }
              })
              updateLoader(false)
       
      }//catch function close
      
    } //main funciton resigter closed

  

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */

    let data={
      "username":username,
      "password":password,
      "confirmPassword":confirmPassword
    }

    const eventHandler=()=>{
        validateInput(data) && register(data)
    }


  const validateInput = (data) => {
      const {username,password,confirmPassword}=data;
      let lenUsername=username.length;
      let lenpass=password.length;
      if(lenUsername<1){
        enqueueSnackbar("Username is a required field",{ variant: 'warning' });
        return false;
      }else if(lenUsername<6){
        enqueueSnackbar("Username must be at least 6 characters",{ variant: 'warning' });
        return false;
      }else if(lenpass<1){
        enqueueSnackbar("Password is a required field",{ variant: 'warning' });
        return false;
      }else if(lenpass<6){
        enqueueSnackbar("Password must be at least 6 characters",{ variant: 'warning' });
        return false;
      }else if(password!==confirmPassword){
        enqueueSnackbar("Passwords do not match",{ variant: 'warning' });
        return false;
      }else{
        return true;
      }

   
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
     
    >
      <Header hasHiddenAuthButtons={true} />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            onChange={(e)=>updateUserName(e.target.value)}
            fullWidth

          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            onChange={(e)=>updatePassword(e.target.value)}
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            onChange={(e)=>updateConfirmPasswrod(e.target.value)}
            type="password"
            fullWidth
          />
          {loader ?<Box sx={{ display: 'flex',justifyContent:"center" }}>
                    <CircularProgress />
                   </Box>
                  :<Button onClick={eventHandler}  className="button" variant="contained">
            Register Now
           </Button>
           }
           
          <p className="secondary-action">
            Already have an account?{" "}
            <Link to="/login" className={"link"}>Login here</Link>
            
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
