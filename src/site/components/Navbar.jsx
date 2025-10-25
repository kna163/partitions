import {NavLink} from 'react-router-dom';
import './Navbar.css';
import RoughBasic from "../components/RoughBasic.jsx";


export default function Navbar() {
    return (
        <nav>
            <RoughBasic />
            <NavLink to="/" end> Home </NavLink>
            <NavLink to="/basic">Text Calculator</NavLink>
            {/* <NavLink to="/visual">Visual Editor</NavLink> */}
            <NavLink to="/littlewood">Littlewood</NavLink>
            <NavLink to="/notes">Notes</NavLink>
            {/* <NavLink to="/sample">Sample</NavLink> */}
        </nav>
    );
}