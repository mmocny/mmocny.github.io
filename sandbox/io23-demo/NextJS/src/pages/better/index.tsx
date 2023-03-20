'use client';
import { ChangeEvent, Suspense, startTransition, use, useMemo, useState } from "react";

import getSailData from "@/common/getSailData";
import useDebouncedEffect from "@/hooks/useDebouncedEffect";
import SearchBar from "@/common/components/SearchBar";
import AutoCompleteSync from "@/components/AutoCompleteSync";
import dynamic from "next/dynamic";

 function ReactSearchBetter() {
	const sailData = use(useMemo(() => getSailData(), []));
	const [searchTerm, setSearchTerm] = useState("");
	const [autoCompleteTerm, setAutoCompleteTerm] = useState(searchTerm);

	// Because we debounce the effect, we don't use the transition isPending
	const isPending = searchTerm != autoCompleteTerm;

	useDebouncedEffect(() => {
		startTransition(() => {
			setAutoCompleteTerm(searchTerm);
		});
	}, [searchTerm, setAutoCompleteTerm], 1000);

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

const Page = dynamic(async () => ReactSearchBetter, { ssr: false });
export default Page;