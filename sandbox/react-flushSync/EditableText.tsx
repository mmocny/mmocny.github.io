import React, { useState, useRef, forwardRef, use, cache, useDeferredValue } from "react";
import { flushSync } from "react-dom";
import { useAfterNextLayout } from "./hooks/useAfterNextLayout";
import useAwaitableTransition from "./hooks/useAwaitableTransition";

function delay(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchData(text) {
	await delay(1000);
	return text;
}

export function EditableText({ text, setText }) {
	const [isEdit, setIsEdit] = useState(false);
	const ref = useRef(null);
	const afterNextLayout = useAfterNextLayout();
	const [isPending, startAwaitableTransition] = useAwaitableTransition();

	if (isEdit) {
		// Proof of concept to get edit data from server
		const data = use(cache(fetchData)(text));
	}

	function onInput(event: any) {
		setText(event.target.value);
	}

	function onKeydown(event: any) {
		switch (event.key) {
			case "Enter":
			case "Escape": {
				setIsEdit(false);
				break;
			}
			default:
				break;
		}
	}

	function onBlur(event: any) {
		setIsEdit(false);
	}

	async function onClick(event: any) {
		// FlushSync bad:
		// - Fails if any component is "async" and throws enter loading state
		// - Doesn't work in combination with transitions.
		// flushSync(() => {
		// 	setIsEdit(true);
		// });

		// This is a simple wrapper around useTransition to wrap it in a promise which you can await.
		await startAwaitableTransition(() => {
			setIsEdit(true);
		});

		// Alternative to flushSync:
		// - Simple wrapper around useLayoutEffect, which is sorta like requestAnimationFrame but for React rendering cycle.
		// - conditional useLayoutEffect is annoying to use because you have to manage state (if (shouldEffect) ...)
		// - But here, we can conditionally add a one-off callback to the next layout effect.
		afterNextLayout(() => {
			ref.current?.select();
		});
	}

	return (
		<div>
			{isEdit ? (
				<input type="textbox" ref={ref} onInput={onInput} onBlur={onBlur} onKeyDown={onKeydown} value={text}></input>
			) : (
				<span onClick={onClick}>{text}</span>
			)}
		</div>
	);
}
