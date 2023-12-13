import React, { useState } from "react";
import * as Components from "./Components";

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPassword(password) {
  const passwordRegex = /^(?=.*\d.*\d)(?=.*[a-zA-Z]).{8,}$/;
  return passwordRegex.test(password);
}

function App() {
  const [s, ss] = useState({
    email: "",
    password: "",
  });

  const [state, setState] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [signIn, toggle] = React.useState(true);
  const [loginError, setLoginError] = useState(null);
  const [signupError, setSignupError] = useState(null);

  const handleSignIn = (e) => {
    e.preventDefault();
    const { email, password } = s;

    if (!email || !password) {
      setLoginError("All fields are required");
      setTimeout(() => {
        setLoginError(null);
      }, 3000);
      return;
    }

    if (!isValidEmail(email)) {
      setLoginError("Invalid email format");
      setTimeout(() => {
        setLoginError(null);
      }, 3000);
      return;
    }

    setLoginError(null);

    fetch("http://localhost:5000/login", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userLogin");
        if (data.error) {
          setLoginError(data.error);
          setTimeout(() => {
            setLoginError(null);
          }, 3000);
        } else if (data.status === "error") {
          setLoginError("Invalid Password");
          setTimeout(() => {
            setLoginError(null);
          }, 3000);
        } else if (data.status === "ok") {
          window.localStorage.setItem("token", data.data);
          chrome.tabs.create(
            { url: "./dashboard.html", active: true },
            function (newTab) {
              console.log("New tab created:", newTab);
            }
          );
        }
      });
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    const { name, email, password } = state;

    if (!name || !email || !password) {
      setSignupError("All fields are required");
      setTimeout(() => {
        setSignupError(null);
      }, 3000);
      return;
    }

    if (!isValidEmail(email)) {
      setSignupError("Invalid email format");
      setTimeout(() => {
        setSignupError(null);
      }, 3000);
      return;
    }

    if (!isValidPassword(password)) {
      setSignupError("Password must be of minimum 8 characters with two digits in it");
      setTimeout(() => {
        setSignupError(null);
      }, 3000);
      return;
    }

    setSignupError(null);

    fetch("http://localhost:5000/register", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setSignupError(data.error);
          setTimeout(() => {
            setSignupError(null);
          }, 3000);
        } else {
          console.log(data, "userRegister");
          setState({
            name: "",
            email: "",
            password: "",
          });
          toggle(true);
        }
      });
  };

  return (
    <Components.Container>
      <Components.SignUpContainer signinIn={signIn}>
        <Components.Form>
          <Components.StyledImage src="/images/VAR.png" alt="Your Alt Text Here" />
          <Components.Title>Create Account</Components.Title>
          <Components.Input type="text" placeholder="Name" value={state.name} onChange={(e) => setState({ ...state, name: e.target.value })} />
          <Components.Input type="email" placeholder="Email" value={state.email} onChange={(e) => setState({ ...state, email: e.target.value })} />
          <Components.Input type="password" placeholder="Password" value={state.password} onChange={(e) => setState({ ...state, password: e.target.value })} />
          {signupError && <p>{signupError}</p>}
          <Components.Button onClick={handleSignUp}>Sign Up</Components.Button>
        </Components.Form>
      </Components.SignUpContainer>

      <Components.SignInContainer signinIn={signIn}>
        <Components.Form>
          <Components.StyledImage src="/images/VAR.png" alt="Your Alt Text Here" />
          <Components.Title>Sign in</Components.Title>
          <Components.Input type="email" placeholder="Email" value={s.email} onChange={(e) => ss({ ...s, email: e.target.value })} />
          <Components.Input type="password" placeholder="Password" value={s.password} onChange={(e) => ss({ ...s, password: e.target.value })} />
          {loginError && <p>{loginError}</p>}
          <Components.Anchor href="#">Forgot your password?</Components.Anchor>
          <Components.Button onClick={handleSignIn}>Sign In</Components.Button>
        </Components.Form>
      </Components.SignInContainer>

      <Components.OverlayContainer signinIn={signIn}>
        <Components.Overlay signinIn={signIn}>
          <Components.LeftOverlayPanel signinIn={signIn}>
            <Components.Title1>Welcome Back!</Components.Title1>
            <Components.Paragraph>To keep connected with us, please login with your personal info</Components.Paragraph>
            <Components.GhostButton onClick={() => toggle(true)}>Sign In</Components.GhostButton>
          </Components.LeftOverlayPanel>

          <Components.RightOverlayPanel signinIn={signIn}>
            <Components.Title1>Hello, Friend!</Components.Title1>
            <Components.Paragraph>Enter your personal details and start the journey with us</Components.Paragraph>
            <Components.GhostButton onClick={() => toggle(false)}>Sign Up</Components.GhostButton>
          </Components.RightOverlayPanel>
        </Components.Overlay>
      </Components.OverlayContainer>
    </Components.Container>
  );
}

export default App;
