import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import NotFound from "./pages/NotFound";

import Footer from "./components/Footer/Footer";

import WelcomeScreen from "./components/WelcomeScreen/WelcomeScreen";

const App = () => {
    return(
        <div>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Home" element={<Home />} />
                <Route path="/*" element={<NotFound />} />
            </Routes>
            <Footer />
            <WelcomeScreen />
        </div>
    );
}
export default App;