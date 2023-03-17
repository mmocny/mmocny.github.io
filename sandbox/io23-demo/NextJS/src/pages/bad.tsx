'use client';

import { ChangeEvent, Suspense, useState } from "react";

import SearchBar from "../components/SearchBar";
import AutoCompleteSync from "../components/AutoCompleteSync";

export default function Search() {
	const [searchTerm, setSearchTerm] = useState("");

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		const searchTerm = e.target.value;
		setSearchTerm(searchTerm);
	};

	return (
		<>
			<SearchBar searchTerm={searchTerm} onChange={onChange}></SearchBar>

			<Suspense>
				{/* <AutoCompleteSync searchTerm={searchTerm}></AutoCompleteSync> */}
			</Suspense>
		</>
	)
}