'use client';

import { ChangeEvent, Suspense, useState, useTransition } from "react";
import AutoComplete from "./AutoCompleteBad";
// import AutoComplete from "./AutoCompleteBetter";
// import AutoComplete from "./AutoCompleteBest";

export default function SearchBar() {
	const [isPending, startTransition] = useTransition();
	const [searchTerm, setSearchTerm] = useState("");
	const [autoCompleteTerm, setAutoCompleteTerm] = useState(searchTerm);

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		const searchTerm = e.target.value;
		setSearchTerm(searchTerm);

		// Flip this with Better/Best
		startTransition(() => {
			setAutoCompleteTerm(searchTerm);	
		});
	};

	return (
		<>
			<form className="w-full max-w-sm" onSubmit={(e) => e.preventDefault()}>
				<div className="flex items-center border-b border-teal-500 py-2">
					<input onChange={onChange} value={searchTerm} className="appearance-none bg-transparent border-none w-full mr-3 py-1 px-2 leading-tight focus:outline-none" type="text" placeholder="Search" aria-label="Full name"></input>
				</div>
			</form>

			<Suspense>
				<div className={isPending ? "blur-sm" : ""}>
					<AutoComplete searchTerm={autoCompleteTerm}></AutoComplete>
				</div>
			</Suspense>
		</>
	)
}