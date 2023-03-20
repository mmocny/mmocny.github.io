import { SearchResult } from "../createSearchTasks";

export default function SailboatResults({ results }: { results: SearchResult[] }) {
	return (
		<div className="result summary">Results ({results.length}):</div>
	);
}
