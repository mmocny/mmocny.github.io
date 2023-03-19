import { Suspense } from "solid-js";
import { Outlet } from "solid-start";

// TODO: Layout only works if you nest it in a folder and use the same name...
// I haven't found a way to apply a layout to the root folder.
// Still -- <Suspense> wrapper wasn't working
export default function Layout() {
	return <>
		<Suspense fallback={"Loading Data..."}>
			<Outlet/>
		</Suspense>
	</>
}