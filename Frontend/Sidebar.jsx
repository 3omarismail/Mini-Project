import React from 'react';
import { NavLink } from 'react-router-dom';
import { BsBriefcase } from "react-icons/bs";
import { BsGrid1X2Fill, BsListCheck, BsMenuButtonWideFill, BsGear ,BsFillBellFill,BsPeopleFill} from 'react-icons/bs';

function Sidebar({ openSidebarToggle, OpenSidebar }) {
  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
      <div className='sidebar-title'>
        <div className='sidebar-brand'>
        <BsBriefcase  className='icon_header' /> MANAGEMENT
        </div>
        <span className='icon close_icon' onClick={OpenSidebar}>X</span>
      </div>

      <ul className='sidebar-list'>
        <li className='sidebar-list-item'>
          <NavLink to="/" className="sidebar-link" onClick={OpenSidebar}> {/* Close sidebar on navigation */}
            <BsGrid1X2Fill className='icon' /> Dashboard
          </NavLink>
        </li>

        <li className='sidebar-list-item'>
          <NavLink to="/projects" className="sidebar-link" onClick={OpenSidebar}>
            <BsMenuButtonWideFill className='icon' /> Projects
          </NavLink>
        </li>
        <li className='sidebar-list-item'>
          <NavLink to="/tasks" className="sidebar-link" onClick={OpenSidebar}>
            <BsListCheck className='icon' /> Tasks
          </NavLink>
        </li>
        <li className='sidebar-list-item'>
          <NavLink to="/customers" className="sidebar-link" onClick={OpenSidebar}>
            <BsPeopleFill className='icon' /> Customers
          </NavLink>
        </li>
        <li className='sidebar-list-item'>
          <NavLink to="/alerts" className="sidebar-link" onClick={OpenSidebar}>
          <BsFillBellFill className='card_icon'/> Alerts
          </NavLink>
        </li>
        <li className='sidebar-list-item'>
          <NavLink to="/settings" className="sidebar-link" onClick={OpenSidebar}>
            <BsGear className='icon' /> Settings
          </NavLink>
        </li>
        {/* Login is handled by conditional rendering or a guard, so not in sidebar */}
      </ul>
    </aside>
  );
}

export default Sidebar;