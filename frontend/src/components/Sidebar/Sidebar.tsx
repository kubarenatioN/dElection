import { FC } from 'react'
import { Link } from 'react-router-dom'
import './Sidebar.css';

interface SidebarProps {
  
}

const Sidebar: FC<SidebarProps> = ({}) => {
  return <div className='container'>
    <span>
      Sidebar
    </span>
    <Link to={'/test-1'}>Page 1</Link>
  </div>
}

export default Sidebar