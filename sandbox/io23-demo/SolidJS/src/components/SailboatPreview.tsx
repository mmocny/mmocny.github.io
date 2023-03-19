import { SearchResult } from "~/common/createSearchTasks";

export default function SailboatPreview({ result }: { result: SearchResult }) {
	const boat = result.item;
	return (
		<div class="max-w-sm w-full lg:max-w-full lg:flex">
			<div class="border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
				<div class="mb-8">
					<div class="text-gray-900 font-bold text-xl mb-2">{boat.name}</div>
				</div>
				<div class="flex items-center">
					<div class="text-sm">
						<p class="text-gray-900 leading-none">Designer: {boat.designer}</p>
						<p class="text-gray-900 leading-none">Builder: {boat.builder}</p>
						<p class="text-gray-600">Years: {boat["first-built"]} - {boat["last-built"]}</p>
					</div>
				</div>
			</div>
		</div>
	);
}
