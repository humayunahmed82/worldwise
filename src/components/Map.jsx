import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";

const Map = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const lat = searchParams.get("lat");
	const lng = searchParams.get("lng");

	const navigate = useNavigate();

	return (
		<div className={styles.mapContainer} onClick={() => navigate("form")}>
			<h1>Map</h1>
			<p>Lat: {lat}</p>
			<p>Lng: {lng}</p>
		</div>
	);
};

export default Map;
