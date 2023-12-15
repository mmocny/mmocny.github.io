import fs from "fs/promises";
import path from "path";

export default async function Page() {
	const appDir = path.join(process.cwd(), "src/app");
	const files = await fs.readdir(appDir, { recursive: true });

	const pageLinks = files
		.filter((file: string) => {
			const pageName = path.basename(file, ".tsx");
			return pageName === "page";
		})
		.map((file: string) => {
			const pageName = path.dirname(file);
			return (
				<li key={pageName}>
					<a href={pageName}>{pageName}</a>
				</li>
			);
		});

	return <div>{pageLinks}</div>;
}
