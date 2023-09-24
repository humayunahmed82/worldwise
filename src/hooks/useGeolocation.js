import { useReducer } from "react";

const initialState = {
	isLoading: false,
	position: null,
	error: null,
};

const reducer = (state, action) => {
	switch (action.type) {
		case "loading":
			return { ...state, isLoading: false };
		case "position/loaded":
			return { ...state, isLoading: false, position: action.payload };
		case "error":
			return { ...state, isLoading: false, error: action.payload };

		default:
			throw new Error("Unknown action type");
	}
};

const useGeolocation = (defaultPosition = null) => {
	const [state, dispatch] = useReducer(reducer, initialState);
	const { isLoading, position, error } = state;

	// const [isLoading, setIsLoading] = useState(false);
	// const [position, setPosition] = useState(defaultPosition);
	// const [error, setError] = useState(null);

	function getPosition() {
		if (!navigator.geolocation)
			return dispatch({
				type: "error",
				payload: "Your browser does not support geolocation",
			});

		dispatch({ type: "loading" });

		navigator.geolocation.getCurrentPosition(
			(pos) => {
				dispatch({
					type: "position/loaded",
					payload: {
						lat: pos.coords.latitude,
						lng: pos.coords.longitude,
					},
				});
			},
			(error) => {
				dispatch({ type: "error", payload: error.message });
			}
		);
	}

	return { isLoading, position, error, getPosition };
};

export { useGeolocation };
