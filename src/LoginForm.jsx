import React, {useState} from "react";
import * as Components from './Components';

function App({ onSignIn }) {

    const [state, setState] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [signIn, toggle] = React.useState(true);

        const handleSignIn = () => {
            if (onSignIn) {
            onSignIn();
            }
        };

        const handleSubmit = (e) => {
            e.preventDefault();
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

     return(
         <Components.Container>
             <Components.SignUpContainer signinIn={signIn}>
                 <Components.Form>
                     <Components.StyledImage src="/images/VAR.png" alt="Your Alt Text Here" />
                     <Components.Title>Create Account</Components.Title>
                     <Components.Input type='text' placeholder='Name' onChange={(e) => setState({ ...state, name: e.target.value })}/>
                     <Components.Input type='email' placeholder='Email' onChange={(e) => setState({ ...state, email: e.target.value })}/>
                     <Components.Input type='password' placeholder='Password' onChange={(e) => setState({ ...state, password: e.target.value })}/>
                     <Components.Button onClick={handleSubmit}>Sign Up</Components.Button>
                 </Components.Form>
             </Components.SignUpContainer>

             <Components.SignInContainer signinIn={signIn}>
                  <Components.Form>
                      <Components.StyledImage src="/images/VAR.png" alt="Your Alt Text Here" />
                      <Components.Title>Sign in</Components.Title>
                      <Components.Input type='email' placeholder='Email' />
                      <Components.Input type='password' placeholder='Password' />
                      <Components.Anchor href='#'>Forgot your password?</Components.Anchor>
                      <Components.Button onClick={handleSignIn}>Sign In</Components.Button>
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