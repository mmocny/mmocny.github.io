'use client';

import { ChangeEvent, Suspense, useState } from "react";

import useAbortSignallingTransition from "../hooks/utils/useAbortSignallingTransition";
import SearchBar from "../components/SearchBar";
import AutoCompleteAsync from "../components/AutoCompleteAsync";
import useSailBoatData from "@/hooks/app/useSailboatData";

export default function Search() {
	const [isReady, sailData] = useSailBoatData();
	const [isPending, startAbortingTransition, abortSignal] = useAbortSignallingTransition();
	const [searchTerm, setSearchTerm] = useState("");
	const [autocompleteTerm, setAutocompleteTerm] = useState(searchTerm);

	if (!isReady) {
		return "Loading Data...";
	}

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
					<AutoCompleteAsync searchTerm={autocompleteTerm} sailData={sailData!} abortSignal={abortSignal}></AutoCompleteAsync>
				</Suspense>
			</div>
		</>
	)
}