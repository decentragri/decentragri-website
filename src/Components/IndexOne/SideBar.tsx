import { useLocation } from "wouter";
import { useCallback, useEffect } from "preact/hooks";
import { JSX } from "preact";
import { useThemeStore } from '../../context/ThemeContext';

interface MenuItem {
  href: string;
  icon: string;
}

// Menu items for the static site
const menuItems: MenuItem[] = [
  { href: "/", icon: "fi-sr-home" },
  { href: "/about", icon: "fi-sr-info" },
  { href: "/contact", icon: "fi-sr-envelope" }
];

const SideBar = (): JSX.Element => {
  const [location, setLocation] = useLocation();
  const { isDarkMode, toggleTheme } = useThemeStore();

  const handleClick = useCallback(
    (e: JSX.TargetedMouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      setLocation(href);
    },
    [setLocation]
  );

  // Menu items for the static site

  // Apply dark mode class to the root element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  return (
    <div className="sidebar">
      <div className="sidebar-logo mb-25">
        <a href="/">
          <img src="/assets/img/logo/decentra_logo2.png" alt="Decentragri Logo" />
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
