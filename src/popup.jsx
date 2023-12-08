import React from "react";
import ReactDOM from "react-dom";
import  LandingPage from "./LandingPage.jsx";
import App from "./loginForm.jsx";
import { BrowserRouter } from "react-router-dom";
import WelcomePage from "./sidebar.jsx";

const root = ReactDOM.createRoot(document.getElementById("react-target"));

root.render(
    <React.StrictMode>
        <BrowserRouter>
        <App/>
        </BrowserRouter>
    </React.StrictMode>    
)

// function Popup() {
//     return (
//         <div>
//             <App/>
//         </div>
//     );
// }

// render(<Popup/>, document.getElementById("react-target"));