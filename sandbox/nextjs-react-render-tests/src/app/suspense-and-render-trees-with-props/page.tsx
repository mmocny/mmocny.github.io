"use client";

import React, { Suspense, useState } from "react";

const BREADTH = 3;
const DEPTH = 3;


function block(ms) {
	const target = performance.now() + ms;
	while (performance.now() < target);
}

function Leaf({ start }) {
	block(3);
	return <div>{start}</div>;
}

function Branch({ start }) {
	return (
		<div>
			{Array.from({ length: DEPTH }).map((_, index) => (
				<Leaf key={index} start={start + index} />
			))}
		</div>
	);
}

function Tree({ start }) {
	const renderTree = (currentDepth, start) => {
		if (currentDepth === 0) {
			return <Suspense><Branch start={start} /></Suspense>;
		}

		return (
			<ul>
				{Array.from({ length: DEPTH }).map((_, index) => (
					<li key={index}>{renderTree(currentDepth - 1, start + index * Math.pow(DEPTH, currentDepth))}</li>
				))}
			</ul>
		);
	};

	return <div>{renderTree(DEPTH, start)}</div>;
}


export default function Page() {
	const [count, setCount] = useState(0);

	return (
		<div>
			<button onClick={() => setCount(count + 1)}>Increment</button>
			<Tree start={count} />
		</div>
	);
}
