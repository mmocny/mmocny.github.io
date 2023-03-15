export default function SearchBar({ searchTerm, onChange }: { searchTerm: string, onChange: any }) {
	return <>
		<form className="w-full max-w-sm" onSubmit={(e) => e.preventDefault()}>
			<div className="flex items-center border-b border-teal-500 py-2">
				<input onChange={onChange} value={searchTerm} className="appearance-none bg-transparent border-none w-full mr-3 py-1 px-2 leading-tight focus:outline-none" type="text" placeholder="Search" aria-label="Full name"></input>
			</div>
		</form>
	</>;
}