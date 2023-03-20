import { SearchResult } from "../createSearchTasks";

export default function SailboatPreview({ result }: { result: SearchResult }) {
	const boat = result.item;
	return (
		<div className="result item">
			<div className="">{boat.name}</div>
			<div className="">Designer: {boat.designer}</div>
			<div className="">Builder: {boat.builder}</div>
			<div className="">Years: {boat["first-built"]} - {boat["last-built"]}</div>
		</div>
	);
}
