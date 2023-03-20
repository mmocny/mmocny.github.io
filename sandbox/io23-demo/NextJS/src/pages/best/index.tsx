'use client';
import { ChangeEvent, Suspense, use, useMemo, useState } from "react";

import getSailData from "@/common/getSailData";
import useAbortSignallingTransition from "@/hooks/useAbortSignallingTransition";
import SearchBar from "@/common/components/SearchBar";
import AutoCompleteAsync from "@/components/AutoCompleteAsync";
import dynamic from "next/dynamic";

function ReactSearchBest() {
	const sailData = use(useMemo(() => getSailData(), []));

	const [isPending, startAbortSignallingTransition, abortSignal] = useAbortSignallingTransition();

	const [searchTerm, setSearchTerm] = useState("");
	const [autocompleteTerm, setAutocompleteTerm] = useState(searchTerm);

	const onInput = async (e: ChangeEvent<HTMLInputElement>) => {
		const searchTerm = e.target.value;
		setSearchTerm(searchTerm);
		try {
			await startAbortSignallingTransition(() => {
				setAutocompleteTerm(searchTerm);
			});
		} catch { }
	};

	return (
		<>
			<SearchBar searchTerm={searchTerm} onInput={onInput}></SearchBar>

			<div className={isPending ? "blur-sm" : ""}>
				<Suspense>
					<AutoCompleteAsync searchTerm={autocompleteTerm} sailData={sailData!} abortSignal={abortSignal}></AutoCompleteAsync>
				</Suspense>
			</div>
		</>
	)
}

const Page = dynamic(async () => ReactSearchBest, { ssr: false });
export default Page;
