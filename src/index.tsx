import { useEffect, useState, useCallback } from "preact/hooks";
import { LocationProvider, Router, Route, hydrate, prerender as ssr } from 'preact-iso';

import Blog from './pages/Blog';
import BlogDetails from './pages/BlogDetails';
import Home from './pages/Home';
import About from "./pages/About";
import ContactPage from "./pages/ContactPage";
import TreeNFTs from "./Components/TreeNFT/TreeNFTs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import NotFoundPage from './pages/NotFoundPage';

import "./assets/css/privacy-policy.css";
import "./assets/css/terms-of-service.css";
import TreeNFTPage from "./pages/TreeNFTPage";


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
				<LocationProvider>
					<main>
						<Router>
							<Route path="/" component={Home} />
							<Route path="/about" component={About} />
							<Route path="/contact" component={ContactPage} />
							<Route path="/tree-nfts" component={TreeNFTPage} />
							{/* <Route path="/blog" component={Blog} />
							<Route path="/blog-details" component={BlogDetails} /> */}
							<Route path="/privacy-policy" component={PrivacyPolicy} />
							<Route path="/terms-of-service" component={TermsOfService} />
							<Route path="/:404*" component={NotFoundPage} />
						</Router>
					</main>
				</LocationProvider>
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
