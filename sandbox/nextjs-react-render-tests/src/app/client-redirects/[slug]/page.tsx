"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";

function block(ms: number) {
	const target = performance.now() + ms;
	while (performance.now() < target);
}

export default function Page() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams()!;

	const createQueryString = useCallback(
		(name: string, value: string) => {
			const params = new URLSearchParams(searchParams);
			params.set(name, value);
			return params.toString();
		},
		[searchParams]
	);

	const testParam = searchParams.get("test");
	const valueParam = searchParams.get("value");
	const newValue = Math.random().toString(32).substring(2);

	// useEffect(() => {
	// 	if (testParam === "foobar") return;
	// 	block(10);
	// 	router.replace(pathname + "?" + createQueryString("test", "foobar"));
	// }, [createQueryString, pathname, router, testParam]);

	const times = Math.floor(Math.random() * 50);

	return (
		<div>
			<li>
				<Link href="?">Reset</Link>
			</li>
			<li>
				<Link href={pathname + newValue + "?" + createQueryString("value", newValue)}>Random</Link>
			</li>
			{Array(times)
				.fill(null)
				.map((_, index) => (
					<li>{valueParam}</li>
				))}
		</div>
	);
}
