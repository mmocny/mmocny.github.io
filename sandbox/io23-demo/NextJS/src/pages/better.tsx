'use client';

import { ChangeEvent, Suspense, useState } from "react";

import useDebouncedEffect from "../hooks/utils/useDebouncedEffect";
import SearchBar from "../components/SearchBar";
import AutoCompleteSync from "../components/AutoCompleteSync";

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
					<AutoCompleteSync searchTerm={autoCompleteTerm}></AutoCompleteSync>
				</Suspense>
			</div>
		</>
	)
}