'use client';

import { ChangeEvent, Suspense, useState } from "react";

import SearchBar from "./SearchBar";
import AutoComplete from "./AutoCompleteAsync";
import useAbortSignallingTransition from "@/hooks/useAbortSignallingTransition";


export default function Search() {
	const [isPending, startAbortingTransition, abortSignal] = useAbortSignallingTransition();
	const [searchTerm, setSearchTerm] = useState("");
	const [autocompleteTerm, setAutocompleteTerm] = useState(searchTerm);

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		const searchTerm = e.target.value;
		setSearchTerm(searchTerm);
		
		startAbortingTransition(() => {
			setAutocompleteTerm(searchTerm);
		});
	};

	return (
		<>
			<SearchBar searchTerm={searchTerm} onChange={onChange}></SearchBar>

			<div className={isPending ? "blur-sm" : ""}>
				<Suspense>
					<AutoComplete searchTerm={autocompleteTerm} abortSignal={abortSignal}></AutoComplete>
				</Suspense>
			</div>
		</>
	)
}