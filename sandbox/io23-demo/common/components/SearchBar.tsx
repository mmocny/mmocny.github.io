export default function SearchBar({ searchTerm, onInput: onInput }: { searchTerm: string, onInput: (e: any) => void }) {
	return (
		<form className="" onSubmit={(e) => e.preventDefault()}>
			<input className="searchbox" onInput={onInput} value={searchTerm} type="text" placeholder="Search"></input>
		</form>
	);
}