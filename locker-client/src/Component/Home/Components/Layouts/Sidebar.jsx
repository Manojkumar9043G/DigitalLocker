import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div style={{ width: '200px', backgroundColor: '#222', color: 'white', padding: '20px' }}>
      <h2>Digital Locker</h2>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li><Link style={{ color: 'white' }} to="/home">Home</Link></li>
          <li><Link style={{ color: 'white' }} to="/files">My Files</Link></li>
          <li><Link style={{ color: 'white' }} to="/upload">Upload</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
