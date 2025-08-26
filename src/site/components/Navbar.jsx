import {NavLink} from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
    return (
        <nav>
            <p>Navbar loaded</p>
            <NavLink to="/" end> Home </NavLink>
            <NavLink to="/basic">Text Calculator</NavLink>
            <NavLink to="/visual">Visual Editor</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/sample">Sample</NavLink>
        </nav>
    );
}