import { Accessor } from "solid-js";
import SearchBar from "~/common/components/SearchBar";

export default function SolidSearchBar({ searchTerm, onInput: onInput }: { searchTerm: Accessor<string>, onInput: (e: any) => void }) {
	return <SearchBar searchTerm={searchTerm()} onInput={onInput}></SearchBar>;
}