'use client';

import { ChangeEvent, Suspense, startTransition, useState } from "react";

import useDebouncedEffect from "../hooks/utils/useDebouncedEffect";
import SearchBar from "../components/SearchBar";
import AutoCompleteSync from "../components/AutoCompleteSync";
import useSailBoatData from "@/hooks/app/useSailboatData";

export default function Search() {
	const [isReady, sailData] = useSailBoatData();
	const [searchTerm, setSearchTerm] = useState("");
	const [autoCompleteTerm, setAutoCompleteTerm] = useState(searchTerm);

	// Because we debounce the effect, we don't use the transition isPending
	const isPending = searchTerm != autoCompleteTerm;

	useDebouncedEffect(() => {
		startTransition(() => {
			setAutoCompleteTerm(searchTerm);
		});
	}, [searchTerm, setAutoCompleteTerm], 1000);

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

			<div className={isPending ? "blur-sm" : ""}>
				<Suspense>
					<AutoCompleteSync searchTerm={autoCompleteTerm} sailData={sailData!}></AutoCompleteSync>
				</Suspense>
			</div>
		</>
	)
}