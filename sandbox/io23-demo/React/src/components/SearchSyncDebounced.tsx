'use client';

import { ChangeEvent, Suspense, useState } from "react";

import SearchBar from "./SearchBar";
import AutoComplete from "./AutoCompleteSync";
import useDebouncedEffect from "../hooks/utils/useDebouncedEffect";

export default function Search() {
	const [searchTerm, setSearchTerm] = useState("");
	const [autoCompleteTerm, setAutoCompleteTerm] = useState(searchTerm);
	const isPending = searchTerm != autoCompleteTerm;

	 useDebouncedEffect(() => {
		setAutoCompleteTerm(searchTerm);
	}, [searchTerm, setAutoCompleteTerm], 1000);

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		const searchTerm = e.target.value;
		setSearchTerm(searchTerm);
	};

	return (
		<>
			<SearchBar searchTerm={searchTerm} onChange={onChange}></SearchBar>

			<div className={isPending ? "blur-sm" : ""}>
				<Suspense>
					<AutoComplete searchTerm={autoCompleteTerm}></AutoComplete>
				</Suspense>
			</div>
		</>
	)
}