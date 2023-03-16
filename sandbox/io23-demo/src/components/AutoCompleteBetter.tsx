'use client';

import useSailBoatData from "@/hooks/useSailboatData";
import useFilteredResults from "@/hooks/useFilteredResultsBetter";
import { memo, useRef } from "react";
import SailboatPreview from "./SailboatPreview";
import usePrevious from "@/hooks/usePrevious";

// Wrap this component in memo() so we need to re-render list needlessly
export default memo(function AutoComplete({ searchTerm }: { searchTerm: string }) {
	const sailData = useSailBoatData();

	// Every time we get a new search term, overwrite abortController
	// Note: I could not use useEffect for this, becuase it runs after mount/umount, not render
	// Note: I could not use useMemo for this, because:
	// - there seem bugs (...with use()?) where items do not get memoized and so we abort & restart spuriously
	// - useMemo does not support cleanup, nor give access to the previous value, so you need to useRef previous value anyway
	const previousSearchTerm = usePrevious(searchTerm);
	const abortController = useRef<AbortController>();

	if (searchTerm !== previousSearchTerm) {
		abortController.current?.abort();
		abortController.current = new AbortController();
	}

	// This can be expensive!
	const results = useFilteredResults(sailData, searchTerm, abortController.current!.signal);

	if (results.length == 0) {
		return <></>;
	}

	return (
		<>
			<div>Results ({results.length}):</div>
			{ results.slice(0, 10).map((result: any) =>
				<SailboatPreview key={result.item.id} result={result}></SailboatPreview>
			)}
		</>
	);
});