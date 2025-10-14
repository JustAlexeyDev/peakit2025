import './Footer.css';
import { Link } from "react-router-dom";
import { House, MapPinned, CircleUserRound } from "lucide-react";


const Footer = () => {
    return (
        <div className='Footer--Container'>
            <div className='Footer--Container__Body'>

                <Link to="/Home" className='Footer--Conatiner__Body__Button'>
                    <House />
                    <p>Главная</p>
                </Link>

                <Link to="/Map" className='Footer--Conatiner__Body__Button'>
                    <MapPinned />
                    <p>Карта</p>
                </Link>

                <Link to="/Profile" className='Footer--Conatiner__Body__Button'>
                    <CircleUserRound />
                    <p>Профиль</p>
                </Link>
            </div>
        </div>
    );
}
export default Footer;