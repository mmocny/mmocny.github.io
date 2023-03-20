import { SearchResult } from "~/common/createSearchTasks";

export default function SailboatPreview({ result }: { result: SearchResult }) {
	const boat = result.item;
	return (
		<div className="">
			<div className="">
				<div className="">
					<div className="">{boat.name}</div>
				</div>
				<div className="">
					<div className="">
						<p className="">Designer: {boat.designer}</p>
						<p className="">Builder: {boat.builder}</p>
						<p className="">Years: {boat["first-built"]} - {boat["last-built"]}</p>
					</div>
				</div>
			</div>
		</div>
	);
}
