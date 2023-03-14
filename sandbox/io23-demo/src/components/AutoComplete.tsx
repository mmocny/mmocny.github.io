'use client';

import useSailBoatData from "@/hooks/useSailboatData";
import useFilteredResults from "@/hooks/useFilteredResults";
import { memo, useEffect, useRef } from "react";
import SailboatPreview from "./SailboatPreview";

// Wrap this component in memo() so we don't re-compute filtered values unless searchTerm changes.
export default memo(function AutoComplete({ searchTerm }: { searchTerm: string }) {
	const sailData = useSailBoatData();

	const previousSearchTerm = useRef<string | null>(null);
	const abortController = useRef<AbortController | null>(null);

	if (searchTerm !== previousSearchTerm.current) {
		abortController.current?.abort();
		abortController.current = new AbortController();

		previousSearchTerm.current = searchTerm;
	}

	// This can be expensive!
	const results = useFilteredResults(sailData, searchTerm, abortController.current!.signal);

	if (results.length == 0) {
		return <></>;
	}

	// TODO: update UI
	return (
		<>
			<div>Results ({results.length}):</div>
			{ results.slice(0, 10).map((boat: any) =>
				<SailboatPreview key={boat.id} boat={boat}></SailboatPreview>
			)}
		</>
	);
});