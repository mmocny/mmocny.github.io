"use client";

import React, { Suspense, startTransition, useState } from "react";

const BREADTH = 3;
const DEPTH = 3;


function block(ms) {
	const target = performance.now() + ms;
	while (performance.now() < target);
}

function Leaf() {
	const start = Math.random();
	block(3);
	return <div>{start}</div>;
}

function Branch() {
	return (
		<div>
			{Array.from({ length: DEPTH }).map((_, index) => (
				<Leaf key={index} />
			))}
		</div>
	);
}

function Tree() {
	const renderTree = (currentDepth) => {
		if (currentDepth === 0) {
			return <Suspense fallback="Loading"><Branch /></Suspense>;
		}

		return (
			<ul>
				{Array.from({ length: DEPTH }).map((_, index) => (
					<li key={index}>{renderTree(currentDepth - 1)}</li>
				))}
			</ul>
		);
	};

	return <div>{renderTree(DEPTH)}</div>;
}


export default function Page() {
	const [count, setCount] = useState(0);
	
	function onClick() {
		// TODO: should this use the hook form?
		startTransition(() => {
			setCount(count + 1);
		});
	}

	return (
		<div>
			<button onClick={onClick}>Increment</button>
			<Tree/>
		</div>
	);
}
