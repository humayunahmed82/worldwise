import CountryItem from "./CountryItem";
import styles from "./CountryList.module.css";
import Message from "./Message";
import Spinner from "./Spinner";

const CountryList = ({ cities, isLoading }) => {
	if (isLoading) return <Spinner />;
	if (!cities.length)
		return (
			<Message message="Add your first city clicking on a city on the map" />
		);

	return (
		<ul className={styles.cityList}>
			{cities.map((city) => (
				<CountryItem country={city} />
			))}
		</ul>
	);
};

export default CountryList;
