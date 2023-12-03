'use client';

import { useEffect } from "react";

export default function ClientComponent() {
	useEffect(() => {
	  document.addEventListener('DOMContentLoaded', console.log);
	}, []);

	return <p>client</p>;
  }