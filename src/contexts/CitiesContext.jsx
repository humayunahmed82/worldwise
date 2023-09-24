import { createContext, useContext, useEffect, useState } from "react";

const BASE_URL = "http://localhost:8000";

const CitiesContext = createContext();

const CitiesProvider = ({ children }) => {
	const [cities, setCities] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [currentCity, setCurrentCity] = useState({});

	useEffect(() => {
		const fetchCities = async () => {
			try {
				setIsLoading(true);
				const res = await fetch(`${BASE_URL}/cities`);
				const data = await res.json();
				setCities(data);
			} catch (error) {
				alert("There was an error fetching");
			} finally {
				setIsLoading(false);
			}
		};
		fetchCities();
	}, []);

	const getCities = async (id) => {
		try {
			setIsLoading(true);
			const res = await fetch(`${BASE_URL}/cities/${id}`);
			const data = await res.json();
			setCurrentCity(data);
		} catch (error) {
			alert("There was an error fetching");
		} finally {
			setIsLoading(false);
		}
	};

	const createCity = async (newCity) => {
		try {
			setIsLoading(true);
			const res = await fetch(`${BASE_URL}/cities`, {
				method: "POST",
				body: JSON.stringify(newCity),
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await res.json();
			setCities((cities) => [...cities, data]);
		} catch (error) {
			alert("There was an error fetching");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<CitiesContext.Provider
			value={{ cities, isLoading, currentCity, getCities, createCity }}
		>
			{children}
		</CitiesContext.Provider>
	);
};

const useCities = () => {
	const Context = useContext(CitiesContext);
	if (Context === undefined) throw new Error("CitiesContext is undefined");
	return Context;
};

export { CitiesProvider, useCities };
