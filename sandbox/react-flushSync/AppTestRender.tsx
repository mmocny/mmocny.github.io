import React, { useState } from 'react';

function Cell({ text }) {
	return <span>{text}</span>
}

function Row({ row }) {
	return <div className="row">
		{row.map((text, i) => <Cell text={text} />)}
	</div>
}

function Table({ rows }) {
	return rows.map((row, i) => <Row row={row} />);
}

function pickRandomValue(): string {
	return Math.random().toString(36).substring(2, 6);
}

function generateRandomData(x, y): string[][] {
	const rows: string[][] = [];
	for (let i = 0; i < y; i++) {
		const row: string[] = [];
		for (let j = 0; j < x; j++) {
			row.push(pickRandomValue());
		}
		rows.push(row);
	}
	return rows;
}

function fiddleSomeBits(rows, numberOfBits): string[][] {
	for (let i = 0; i < numberOfBits; i++) {
		const x = Math.floor(Math.random() * rows[0].length);
		const y = Math.floor(Math.random() * rows.length);
		rows[y][x] = pickRandomValue();
	}
	return [...rows];
}

export function AppTestRender() {
	const [rows, setRows] = useState(generateRandomData(50, 1000));

	function onClick() {
		const CHANGE_RATE = 0.1;
		const changeCount = Math.floor(rows.length * rows[0].length * CHANGE_RATE);
		setRows(fiddleSomeBits(rows, changeCount));
	}

	return <div onClick={onClick}>
		<Table rows={rows} />
	</div>;
}

export default AppTestRender;