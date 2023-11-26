import React from "react";
import { render } from "react-dom";
import App from "./LoginForm.jsx"; 

function Popup() {
    return (
        <div>
            <App/>
        </div>
    );
}

render(<Popup/>, document.getElementById("react-target"));