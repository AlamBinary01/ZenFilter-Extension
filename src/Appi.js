import { Routes,Route } from "react-router-dom";
import App from "./LoginForm.jsx";
import LandingPage from "./LandingPage.jsx";

function Appi()
{
    return(
        <div className="App">
            <Routes>
                <Route path="/" element={<LandingPage/>}/>
                <Route path="/Login" element={<App/>}/>
            </Routes>
        </div>
    );
}

export default Appi;