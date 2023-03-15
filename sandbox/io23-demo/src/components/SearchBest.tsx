'use client';

import { ChangeEvent, Suspense, useState, useTransition } from "react";

import SearchBar from "./SearchBar";
import AutoComplete from "./AutoCompleteBest";

export default function Search() {
	const [isPending, startTransition] = useTransition();
	const [searchTerm, setSearchTerm] = useState("");
	const [autoCompleteTerm, setAutoCompleteTerm] = useState(searchTerm);

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		const searchTerm = e.target.value;
		setSearchTerm(searchTerm);

		startTransition(() => {
			setAutoCompleteTerm(searchTerm);	
		});
	};

	return (
		<>
			<SearchBar searchTerm={searchTerm} onChange={onChange}></SearchBar>

			<Suspense>
				<div className={isPending ? "blur-sm" : ""}>
					<AutoComplete searchTerm={autoCompleteTerm}></AutoComplete>
				</div>
			</Suspense>
		</>
	)
}