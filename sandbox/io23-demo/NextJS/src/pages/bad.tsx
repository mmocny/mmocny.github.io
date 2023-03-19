'use client';

import { ChangeEvent, useState } from "react";

import SearchBar from "../components/SearchBar";
import AutoCompleteSync from "../components/AutoCompleteSync";
import useSailBoatData from "@/hooks/app/useSailboatData";

export default function Search() {
	const [isReady, sailData] = useSailBoatData();
	const [searchTerm, setSearchTerm] = useState("");

	if (!isReady) {
		return "Loading Data...";
	}

	const onInput = (e: ChangeEvent<HTMLInputElement>) => {
		const searchTerm = e.target.value;
		setSearchTerm(searchTerm);
	};

	return (
		<>
			<SearchBar searchTerm={searchTerm} onInput={onInput}></SearchBar>
			<AutoCompleteSync searchTerm={searchTerm} sailData={sailData!}></AutoCompleteSync>
		</>
	)
}