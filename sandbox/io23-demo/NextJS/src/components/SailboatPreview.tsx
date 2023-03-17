
export default function SailboatPreview({ result }: { result: any }) {
	const boat = result.item;
	return (
		<div className="max-w-sm w-full lg:max-w-full lg:flex">
			<div className="border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
				<div className="mb-8">
					<div className="text-gray-900 font-bold text-xl mb-2">{boat.name}</div>
					<p className="text-gray-700 text-base">{boat.description}</p>
				</div>
				<div className="flex items-center">
					<div className="text-sm">
						<p className="text-gray-900 leading-none">Designer: {boat.designer}</p>
						<p className="text-gray-900 leading-none">Builder: {boat.builder}</p>
						<p className="text-gray-600">Years: {boat["first-built"]} - {boat["last-built"]}</p>
					</div>
				</div>
			</div>
		</div>
	);
}
