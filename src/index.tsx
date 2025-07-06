import { useEffect, useState, useCallback } from "preact/hooks";
import { LocationProvider, Router, Route, hydrate, prerender as ssr } from 'preact-iso';
import { AuthProvider } from './context/AuthContext';

import Activity from './pages/Activity'
import AuthorProfile from './pages/AuthorProfile'
import Blog from './pages/Blog'
import BlogDetails from './pages/BlogDetails'
import Category from './pages/Category'
import Collections from './pages/Collections'
import CreateItem from './pages/CreateItem'
import Creators from './pages/Creators'
import Explore from './pages/Explore'
import Home from './pages/Home'
import LoginRegister from './pages/LoginRegister'
import MarketSingle from './pages/MarketSingle'
import NftLiveBidding from './pages/NftLiveBidding'
import Ranking from './pages/Ranking'
import About from "./pages/About";
import Dashboard from './pages/Dashboard/Dashboard';
import WeatherForecast from "./pages/WeatherForecast";
import StakingPage from './pages/StakingPage';
import NotFoundPage from './pages/NotFoundPage';
import SettingsPage from "./pages/SettingsPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import WalletPage from "./pages/WalletPage";


import "./assets/css/privacy-policy.css";
import "./assets/css/terms-of-service.css";
import FarmPage from "./pages/Farm";
import FarmProfile from "./Components/Farm/FarmProfile";


export function App() {
	const [menuActive, setMenuActive] = useState(false);

	const handleClick = useCallback((e: MouseEvent) => {
		const target = e.target as HTMLElement;
		if (target.closest('.menu-trigger')) {
			e.preventDefault();
			setMenuActive(true);
		} else if (
			target.closest('.menu-close') ||
			target.closest('.offcanvas-overly')
		) {
			setMenuActive(false);
		}
	}, []);

	useEffect(() => {
		document.addEventListener('click', handleClick);
		return () => {
			document.removeEventListener('click', handleClick);
		};
	}, [handleClick]);

	return (
			<div className="App">
				<div className={`offcanvas-wrapper${menuActive ? " active" : ""}`}>
					{/* Offcanvas content */}
					<button className="menu-close"></button>
				</div>
				<div className={`offcanvas-overly${menuActive ? " active" : ""}`} />
				<AuthProvider>
					<LocationProvider>
						<main>
							<Router>
								<Route path="/" component={Home} />
								<Route path="/dashboard" component={Dashboard} />
								<Route path="/dashboard/weather-forecast" component={WeatherForecast} />
								<Route path="/dashboard/farm" component={FarmPage} />
								<Route path="/dashboard/farm/:id" component={FarmProfile} />
								<Route path="/dashboard/staking" component={StakingPage} />
								<Route path="/settings" component={SettingsPage} />
								
								<Route path="/about" component={About} />
								<Route path="/contact" component={ContactPage} />
								<Route path="/collections" component={Collections} />
								<Route path="/blog" component={Blog} />
								<Route path="/blog-details" component={BlogDetails} />
								<Route path="/activity" component={Activity} />
								<Route path="/ranking" component={Ranking} />
								<Route path="/login-register" component={LoginRegister} />
								<Route path="/author-profile" component={AuthorProfile} />
								<Route path="/create-item" component={CreateItem} />
								<Route path="/category" component={Category} />
								<Route path="/creators" component={Creators} />
								<Route path="/market-single" component={MarketSingle} />
								<Route path="/nft-live-bidding" component={NftLiveBidding} />
								<Route path="/privacy-policy" component={PrivacyPolicy} />
								<Route path="/terms-of-service" component={TermsOfService} />
								<Route path="/wallet" component={WalletPage} />
								<Route path="/:404*" component={NotFoundPage} />
							</Router>
						</main>
					</LocationProvider>
				</AuthProvider>
			</div>
	);
}

if (typeof window !== 'undefined') {
	const appElement = document.getElementById('app');
	if (appElement) {
		hydrate(<App />, appElement);
	}
}

if (typeof window !== 'undefined') {
	const appElement = document.getElementById('app');
	if (appElement) {
		hydrate(<App />, appElement);
	}
}

export async function prerender(data: any) {
	return await ssr(<App {...data} />);
}
