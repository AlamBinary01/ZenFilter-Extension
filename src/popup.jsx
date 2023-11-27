import React from "react";
import ReactDOM from "react-dom";
import App from "./LoginForm.jsx"; 
import  LandingPage from "./LandingPage.jsx";
import Appi from "./Appi.js";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("react-target"));

root.render(
    <React.StrictMode>
        <BrowserRouter>
        <LandingPage/>        
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