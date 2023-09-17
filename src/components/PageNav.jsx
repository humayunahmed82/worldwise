import { NavLink } from "react-router-dom";
import styles from "./PageNav.module.css";
import Logo from "./Logo";

const PageNav = () => {
	return (
		<nav className={styles.nav}>
			<Logo />

			<ul>
				<li>
					<NavLink to="/pricing">Pricing</NavLink>
				</li>
				<li>
					<NavLink to="/product">Product</NavLink>
				</li>
				<li>
					<NavLink className={styles.ctaLink} to="/login">
						login
					</NavLink>
				</li>
			</ul>
		</nav>
	);
};

export default PageNav;
