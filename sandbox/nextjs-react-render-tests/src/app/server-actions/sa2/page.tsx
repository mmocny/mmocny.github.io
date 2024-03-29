import { revalidatePath } from "next/cache";
import Link from "next/link";

const items: number[] = [];

export default function Home() {
	async function add() {
		"use server";
		items.push(items.length);
		revalidatePath('/sa2');
	}	

	return <>
		<Link href="/sa">Page 1</Link>
		<form action={add}>
			<input type="submit" value="Add Item"></input>
		</form>
		<h3>Items:</h3>
		<ul>
			{ items.map(i => <li key={i}>{i}</li>) }
		</ul>
	</>

}