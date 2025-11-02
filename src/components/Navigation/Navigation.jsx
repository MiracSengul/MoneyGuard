import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { selectIsLoggedIn } from '../../redux/auth/selectors';
import { IoHomeSharp } from "react-icons/io5";
import { FaDollarSign } from "react-icons/fa6";
import { SlGraph } from "react-icons/sl";
import styles from './Navigation.module.css';

const Navigation = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);

  if (!isLoggedIn) return null;

  const navItems = [
    { path: "/dashboard", icon: IoHomeSharp, label: "Home" },
    { path: "/statistics", icon: SlGraph, label: "Statistics" },
    { path: "/currency", icon: FaDollarSign, label: "Currency", isCurrency: true }
  ];

  return (
    <nav className={styles.nav} aria-label="Main navigation">
      <ul className={styles.navList}>
        {navItems.map(({ path, icon: Icon, label, isCurrency }) => (
          <li key={path} className={`${styles.navItem} ${isCurrency ? styles.currencyItem : ''}`}>
            <NavLink
              to={path}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
              end={path === "/dashboard"}
            >
              <div className={styles.linkContent}>
                <Icon className={styles.navIcon} />
                <span className={styles.linkLabel}>{label}</span>
              </div>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;