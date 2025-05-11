import './NavigationBar.css';
import { Link } from 'react-router-dom';

export default function NavigationBar() {
    return(
        <nav className="top-nav">
            <ul className="nav-list">
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/students">Manage Students</Link></li>
                <li><Link to="/drives">Vaccination Drives</Link></li>
                <li><Link to="/records">Vaccination Records</Link></li>
                <li><Link to="/logout">Logout</Link></li>
            </ul>
        </nav>
    );
}