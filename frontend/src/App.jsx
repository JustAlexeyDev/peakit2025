import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import NotFound from "./pages/NotFound";
import Map from "./pages/Map/Map";

import Footer from "./components/Footer/Footer";

import WelcomeScreen from "./components/WelcomeScreen/WelcomeScreen";

const App = () => {
    return(
        <div>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Home" element={<Home />} />
                <Route path="/*" element={<NotFound />} />
                <Route path="/Map" element={<Map />} />
            </Routes>
            <Footer />
            <WelcomeScreen />
        </div>
    );
}
export default App;