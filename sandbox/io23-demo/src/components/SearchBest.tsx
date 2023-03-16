'use client';

import { ChangeEvent, Suspense, useCallback, useReducer, useRef, useState, useTransition } from "react";

import SearchBar from "./SearchBar";
import AutoComplete from "./AutoCompleteBest";
import objectId from "../../utils/objectId";
import useAbortSignallingTransition from "@/hooks/useAbortSignallingTransition";


export default function Search() {
	const [isPending, startAbortingTransition, abortSignal] = useAbortSignallingTransition();
	const [searchTerm, setSearchTerm] = useState("");
	const [autocompleteTerm, setAutocompleteTerm] = useState(searchTerm);

	const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		const searchTerm = e.target.value;
		setSearchTerm(searchTerm);
		
		startAbortingTransition(() => {
			setAutocompleteTerm(searchTerm);
		});
	}, []);

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