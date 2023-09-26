// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useReducer } from "react";
import styles from "./Form.module.css";
import Button from "./Button";
import ButtonBack from "./ButtonBack";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Message from "./Message";
import Spinner from "./Spinner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCities } from "../contexts/CitiesContext";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

export function convertToEmoji(countryCode) {
	const codePoints = countryCode
		.toUpperCase()
		.split("")
		.map((char) => 127397 + char.charCodeAt());
	return String.fromCodePoint(...codePoints);
}

const initialState = {
	isLoadingGeocodeing: false,
	cityName: "",
	country: "",
	date: new Date(),
	notes: "",
	emoji: "",
	geocodingError: "",
};

const reducer = (state, action) => {
	switch (action.type) {
		case "Loading/error":
			return { ...state, isLoadingGeocodeing: true, geocodingError: "" };
		case "cityName/country/emoji/loading":
			return {
				...state,
				isLoadingGeocodeing: false,
				cityName: action.payload.city || action.payload.locality || "",
				country: action.payload.countryName,
				emoji: convertToEmoji(action.payload.countryCode),
			};
		case "error":
			return { ...state, geocodingError: action.payload };
		case "cityName":
			return {
				...state,
				cityName: action.payload,
			};

		case "date":
			return {
				...state,
				date: action.payload,
			};
		case "notes":
			return {
				...state,
				notes: action.payload,
			};

		default:
			throw new Error("Unknown action type");
	}
};

function Form() {
	const [lat, lng] = useUrlPosition();
	const { createCity, isLoading } = useCities();

	const navigate = useNavigate();

	const [state, dispatch] = useReducer(reducer, initialState);
	const {
		isLoadingGeocodeing,
		cityName,
		country,
		date,
		notes,
		emoji,
		geocodingError,
	} = state;

	useEffect(() => {
		const fetchCityData = async () => {
			try {
				dispatch({ type: "Loading/error" });

				const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);
				const data = await res.json();

				if (!data.countryCode)
					throw new Error(
						"That doesn't seem to be a City. Click somewhere else 😉"
					);

				dispatch({ type: "cityName/country/emoji/loading", payload: data });
			} catch (error) {
				dispatch({ type: "error", payload: error.message });
			}
		};
		fetchCityData();
	}, [lat, lng]);

	const handelSubmit = async (e) => {
		e.preventDefault();

		if (!cityName || !date) return;

		const newCity = {
			cityName,
			country,
			emoji,
			date,
			notes,
			position: { lat, lng },
		};

		await createCity(newCity);
		navigate("/app/cities");
	};

	if (isLoadingGeocodeing) return <Spinner />;

	if (!lat && !lng) return <Message message="Star by clicking on the map" />;

	if (geocodingError) return <Message message={geocodingError} />;

	return (
		<form
			className={`${styles.form} ${isLoading ? styles.loading : ""}`}
			onSubmit={handelSubmit}
		>
			<div className={styles.row}>
				<label htmlFor="cityName">City name</label>
				<input
					id="cityName"
					onChange={(e) =>
						dispatch({ type: "cityName", payload: e.target.value })
					}
					value={cityName}
				/>
				<span className={styles.flag}>{emoji}</span>
			</div>

			<div className={styles.row}>
				<label htmlFor="date">When did you go to {cityName}?</label>

				<DatePicker
					id="date"
					onChange={(date) => dispatch({ type: "date", payload: date })}
					selected={date}
					dateFormat="dd/MM/yyyy"
				/>
			</div>

			<div className={styles.row}>
				<label htmlFor="notes">Notes about your trip to {cityName}</label>
				<textarea
					id="notes"
					onChange={(e) => dispatch({ type: "notes", payload: e.target.value })}
					value={notes}
				/>
			</div>

			<div className={styles.buttons}>
				<Button type="primary">Add</Button>
				<ButtonBack />
			</div>
		</form>
	);
}

export default Form;
