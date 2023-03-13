'use client';

import { Suspense, useState } from "react";
import AutoComplete from "./AutoComplete";

export default function SearchBar() {
	// onChange: Update Autocomplete, blur current UI
	// onSelect: Hide Autocomplete, change UI to results page	

	const [searchTerm, setSearchTerm] = useState("");

	const onChange = (e: any) => {
		setSearchTerm(e.target.value);
	};

	return (
		<>
			<Suspense>
				<input type="text" placeholder="Search" onChange={onChange} value={searchTerm}></input>
				<AutoComplete searchTerm={searchTerm}></AutoComplete>
			</Suspense>
		</>
	)
}