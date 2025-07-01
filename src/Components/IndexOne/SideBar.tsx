import { useLocation } from "wouter";
import { useCallback, useEffect } from "preact/hooks";
import { JSX } from "preact";
import { useAuthStore } from '../../context/AuthContext';
import { useThemeStore } from '../../context/ThemeContext';

interface MenuItem {
  href: string;
  icon: string;
}

// Menu items for logged out users
const publicMenuItems: MenuItem[] = [
  { href: "/", icon: "fi-sr-home" },
];

// Menu items for authenticated users
const authenticatedMenuItems: MenuItem[] = [
  { href: "/dashboard", icon: "fi-sr-apps" },
  { href: "/dashboard/farm", icon: "fi-sr-leaf" },
  // { href: "/farm-data", icon: "fi-sr-chart-line" },
  { href: "/marketplace", icon: "fi-sr-shop" },
  { href: "/dashboard/staking", icon: "fi-sr-dollar" },
  { href: "/wallet", icon: "fi-sr-wallet" },
  { href: "/community", icon: "fi-sr-man-head" },
  { href: "/settings", icon: "fi-sr-settings" }
];

const SideBar = (): JSX.Element => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [location, setLocation] = useLocation();
  const { isDarkMode, toggleTheme } = useThemeStore();

  const handleClick = useCallback(
    (e: JSX.TargetedMouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      setLocation(href);
    },
    [setLocation]
  );

  // Use different menu items based on authentication state
  const menuItems = isLoggedIn ? authenticatedMenuItems : publicMenuItems;

  // Apply dark mode class to the root element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  return (
    <div className={`sidebar ${!isLoggedIn ? 'hidden-on-mobile' : ''}`}>
      <div className="sidebar-logo mb-25">
        <a href="/">
          <img src="/assets/img/logo/decentra_logo2.png" alt="DecentrAgri Logo" />
        </a>
      </div>
      <div className="sidebar-icon">
        <ul>
          {menuItems.map((item) => (
            <li
              key={item.href}
              className={location === item.href ? "active" : ""}
            >
              <a
                href={item.href}
                onClick={(e) => handleClick(e, item.href)}
              >
                <i className={item.icon}></i>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <style jsx>{`
        /* Hide sidebar on mobile for non-logged-in users */
        @media (max-width: 991px) {
          .sidebar.hidden-on-mobile {
            display: none;
          }
          /* Adjust main content when sidebar is hidden */
          .main-content {
            margin-left: 0 !important;
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SideBar;
