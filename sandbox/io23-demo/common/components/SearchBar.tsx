export default function SearchBar({ searchTerm, onInput: onInput }: { searchTerm: string, onInput: (e: any) => void }) {
	return (
		<form className="" onSubmit={(e) => e.preventDefault()}>
			<div className="">
				<input onInput={onInput} value={searchTerm} className="" type="text" placeholder="Search" aria-label="Full name"></input>
			</div>
		</form>
	);
}