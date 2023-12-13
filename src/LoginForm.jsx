import React, {useState} from "react";
import * as Components from './Components';

function App() {

    const [state, setState] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [s , ss] = useState({
        email:"",
        password:""
    })

    const [signIn, toggle] = React.useState(true);
    const [isEmailValid, setIsEmailValid] = React.useState(true);
    const [isSignUpFieldsValid, setIsSignUpFieldsValid] = React.useState(true);
    const [isSignInFieldsValid, setIsSignInFieldsValid] = React.useState(true);
    const [errorMessage, setErrorMessage] = useState("");

        const handleSignIn = (e) => {
            e.preventDefault();

            if (!isEmailValid) {
                alert("Invalid email");
                return;
            }

            if (!isEmailValid || !email || !password) {
                alert("All fields are required.");
                return;
            }

            const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(password)) {
            setErrorMessage("Password must be at least 8 characters long and include at least 1 uppercase letter and 1 digit.");
            return;
        }

        // Clear any previous error messages
        setErrorMessage("");

            const {email, password} = s;
            console.log(email, password);
            fetch("http://localhost:5000/login",{
                method:"POST",
                crossDomain:true,
                headers:{
                    "Content-Type":"application/json",
                    Accept:"application/json",
                    "Access-Control-Allow-Origin":"*"
                },
                body:JSON.stringify({
                    email,
                    password,
                }),
            }).then((res) => res.json())
              .then((data) => {
                console.log(data, "userLogin");
                if(data.status=="ok" ){
                    alert("Login Done");
                    window.localStorage.setItem("token", data.data);
                    chrome.tabs.create({ url: './dashboard.html', active : true },  function(newTab) {
                        console.log('New tab created:', newTab);
                      });
                }
              })
        };

        const handleSignUp = (e) => {
            e.preventDefault();
            if (!isEmailValid) {
                alert("Invalid email");
                return;
            }

            if (!isEmailValid || !email || !password) {
                alert("All fields are required.");
                return;
            }
        
            const {name, email, password} = state;
            console.log(name, email, password);
            fetch("http://localhost:5000/register",{
                method:"POST",
                crossDomain:true,
                headers:{
                    "Content-Type":"application/json",
                    Accept:"application/json",
                    "Access-Control-Allow-Origin":"*"
                },
                body:JSON.stringify({
                    name,
                    email,
                    password,
                }),
            }).then((res) => res.json())
              .then((data) => {
                console.log(data, "userRegister");
              })
        }

        const handleEmailChange = (value) => {
            ss({ ...s, email: value });
        
            // Enhanced email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            setIsEmailValid(emailRegex.test(value));
        }

     return(
         <Components.Container>
             <Components.SignUpContainer signinIn={signIn}>
                 <Components.Form>
                     <Components.StyledImage src="/images/VAR.png" alt="Your Alt Text Here" />
                     <Components.Title>Create Account</Components.Title>
                     <Components.Input type='text' placeholder='Name' onChange={(e) => setState({ ...state, name: e.target.value })}/>
                     <Components.Input type='email' placeholder='Email' onChange={(e) => setState({ ...state, email: handleEmailChange(e.target.value) })}/>
                     <Components.Input type='password' placeholder='Password' onChange={(e) => setState({ ...state, password: e.target.value })}/>
                     <Components.Button onClick={handleSignUp}>Sign Up</Components.Button>
                     {!isEmailValid && (
                        // Comment: Render error message if email is invalid
                        <div style={{ color: 'red', fontSize: '12px', padding: '20px' }}>
                            Email is invalid
                        </div>
                    )}
                    {!isSignUpFieldsValid && (
                        // Comment: Render error message if any field is empty
                        <div style={{ color: 'red', fontSize: '12px' }}>
                            All fields are required
                        </div>
                    )}

                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Display error message */}

                 </Components.Form>
             </Components.SignUpContainer>

             <Components.SignInContainer signinIn={signIn}>
                  <Components.Form>
                      <Components.StyledImage src="/images/VAR.png" alt="Your Alt Text Here" />
                      <Components.Title>Sign in</Components.Title>
                      <Components.Input type='email' placeholder='Email' onChange={(e) => ss({ ...s, email: handleEmailChange(e.target.value) })}/>
                      <Components.Input type='password' placeholder='Password' onChange={(e) => ss({ ...s, password: e.target.value })}/>
                      <Components.Anchor href='#'>Forgot your password?</Components.Anchor>
                      <Components.Button onClick={handleSignIn}>Sign In</Components.Button>
                      {!isEmailValid && (
                        // Comment: Render error message if email is invalid
                        <div style={{ color: 'red', fontSize: '12px', padding: '20px' }}>
                            Email is invalid
                        </div>
                    )}
                    {!isSignUpFieldsValid && (
                        // Comment: Render error message if any field is empty
                        <div style={{ color: 'red', fontSize: '12px' }}>
                            All fields are required
                        </div>
                    )}
                  </Components.Form>
             </Components.SignInContainer>

             <Components.OverlayContainer signinIn={signIn}>
                 <Components.Overlay signinIn={signIn}>

                 <Components.LeftOverlayPanel signinIn={signIn}>
                     <Components.Title1>Welcome Back!</Components.Title1>
                     <Components.Paragraph>
                         To keep connected with us please login with your personal info
                     </Components.Paragraph>
                     <Components.GhostButton onClick={() => toggle(true)}>
                         Sign In
                     </Components.GhostButton>
                     </Components.LeftOverlayPanel>

                     <Components.RightOverlayPanel signinIn={signIn}>
                       <Components.Title1>Hello, Friend!</Components.Title1>
                       <Components.Paragraph>
                           Enter Your personal details and start journey with us
                       </Components.Paragraph>
                           <Components.GhostButton onClick={() => toggle(false)}>
                               Sign Up
                           </Components.GhostButton> 
                     </Components.RightOverlayPanel>
 
                 </Components.Overlay>
             </Components.OverlayContainer>

         </Components.Container>
     )
}

export default App;