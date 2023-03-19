import { Accessor, JSX } from "solid-js";

export default function SearchBar({ searchTerm, onInput: onInput }: { searchTerm: Accessor<string>, onInput: JSX.EventHandler<HTMLInputElement, InputEvent> }) {
	return <>
		<form class="p-5 w-full max-w-sm text-2xl font-semibold" onSubmit={(e) => e.preventDefault()}>
			<div class="flex items-center border-b border-teal-500 py-2">
				<input onInput={onInput} value={searchTerm()} class="appearance-none bg-transparent border-none w-full mr-3 py-1 px-2 leading-tight focus:outline-none" type="text" placeholder="Search" aria-label="Full name"></input>
			</div>
		</form>
	</>;
}