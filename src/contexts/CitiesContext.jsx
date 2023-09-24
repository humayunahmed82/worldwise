import { createContext, useContext, useEffect, useReducer } from "react";

const BASE_URL = "http://localhost:8000";

const CitiesContext = createContext();

const initialState = {
	cities: [],
	isLoading: false,
	currentCity: {},
	errorMessage: "",
};

const reducer = (state, action) => {
	switch (action.type) {
		case "loading":
			return { ...state, isLoading: true };
		case "cities/loaded":
			return { ...state, isLoading: false, cities: action.payload };
		case "cities/created":
			return {
				...state,
				isLoading: false,
				cities: [...state.cities, action.payload],
				currentCity: action.payload,
			};
		case "cities/deleted":
			return {
				...state,
				isLoading: false,
				cities: state.cities.filter((city) => city.id !== action.payload),
				currentCity: {},
			};
		case "currentCity/loaded":
			return {
				...state,
				isLoading: false,
				currentCity: action.payload,
			};
		case "rejected":
			return { ...state, isLoading: false, error: action.payload };
		default:
			throw new Error("Unknown action type");
	}
};

const CitiesProvider = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialState);
	const { cities, isLoading, currentCity } = state;

	useEffect(() => {
		const fetchCities = async () => {
			dispatch({ type: "loading" });
			try {
				const res = await fetch(`${BASE_URL}/cities`);
				const data = await res.json();
				dispatch({ type: "cities/loaded", payload: data });
			} catch (error) {
				dispatch({
					type: "reject",
					payload: "There was an error fetching",
				});
			}
		};
		fetchCities();
	}, []);

	const getCities = async (id) => {
		if (Number(id) === currentCity.id) return;

		dispatch({ type: "loading" });
		try {
			const res = await fetch(`${BASE_URL}/cities/${id}`);
			const data = await res.json();
			dispatch({ type: "currentCity/loaded", payload: data });
		} catch (error) {
			dispatch({
				type: "rejected",
				payload: "There was an error fetching",
			});
		}
	};

	const createCity = async (newCity) => {
		dispatch({ type: "loading" });
		try {
			const res = await fetch(`${BASE_URL}/cities`, {
				method: "POST",
				body: JSON.stringify(newCity),
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await res.json();
			dispatch({
				type: "cities/created",
				payload: data,
			});
		} catch (error) {
			dispatch({
				type: "rejected",
				payload: "There was an error creating the city",
			});
		}
	};

	const deleteCity = async (id) => {
		dispatch({ type: "loading" });
		try {
			await fetch(`${BASE_URL}/cities/${id}`, {
				method: "DELETE",
			});

			dispatch({
				type: "cities/deleted",
				payload: id,
			});
		} catch (error) {
			dispatch({
				type: "rejected",
				payload: "There was an error deleting the city",
			});
		}
	};

	return (
		<CitiesContext.Provider
			value={{
				cities,
				isLoading,
				currentCity,
				getCities,
				createCity,
				deleteCity,
			}}
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

// 19. Adding Fake Authentication Setting Up Context
