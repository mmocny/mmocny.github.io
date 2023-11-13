import React, { useState, useRef, forwardRef, use, cache, useDeferredValue  } from "react";
import { flushSync } from "react-dom";
import { useAfterNextLayout } from "./useAfterNextLayout";

function delay(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
	
async function fetchData() {
	await delay(1000);
}

export function EditableText({ text, setText }) {
	const [isEdit, setIsEdit] = useState(false);
	const ref = useRef(null);
	const afterNextLayout = useAfterNextLayout();

	// can use use() conditionally ;)
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

	function onClick(event: any) {
		// flushSync(() => {
			setIsEdit(true);
		// });

		// With flushSync, this next line won't run until after next state update and next render pass
		// with afterNextLayout, the effect won't trigger until this specific component is added to DOM

		afterNextLayout(() => {
			ref.current?.select();
		});
	}

	return (
		<div>
			{isEdit ? (
				<input
				type="textbox"
				ref={ref}
				onInput={onInput}
				onBlur={onBlur}
				onKeyDown={onKeydown}
				value={text}
			></input>
			) : (
				<span onClick={onClick}>{text}</span>
			)
			}
		</div >
	);
}