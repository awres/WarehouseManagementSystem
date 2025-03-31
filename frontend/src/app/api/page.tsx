"use client";

import axios from "axios";
import { useEffect } from "react";

const URL = "http://localhost:8000/";

const test = () => {
	const fetchData = async () => {
		await axios.get(`${URL}customers`).then((res) => console.log(res));
	};

	useEffect(() => {
		fetchData();
	}, []);

	return <></>;
};

export default test;
