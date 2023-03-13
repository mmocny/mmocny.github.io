'use client';

import useSailBoatData from "@/hooks/useSailboatData";
import useFilteredResults from "@/hooks/useFilteredResults";

function QuickBoatInfo({ boat }: any) {
	return <li>{boat.name}</li>
}

export default function AutoComplete({ searchTerm }: any) {
	console.log('rendering on', typeof navigator === 'undefined' ? 'server' : 'client');
	
	const sailData = useSailBoatData();
	const results = useFilteredResults(sailData, searchTerm);

	return (
		<>
			<ul>
				<li>Results ({results.length}):</li>
				{ results.map((boat: any) =>
					<QuickBoatInfo key={boat.id} boat={boat}></QuickBoatInfo>
				)}
			</ul>
		</>
	)
}