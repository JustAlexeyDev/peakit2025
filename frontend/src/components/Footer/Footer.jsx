import './Footer.css';
import { Link } from "react-router-dom";


const Footer = () => {
    return(
        <div className='Footer--Container'>
            <div className='Footer--Container__Body'>
                <Link to="/Map">Карта</Link>
                <button>1</button>
                <button>1</button>
                <button>1</button>
            </div>
        </div>
    );
}
export default Footer;