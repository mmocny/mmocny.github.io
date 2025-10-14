"use client";

import { useState } from "react";

// Some really complex math problem, any fancy math, that takes ~many ms to run
function computeComplexMathProblem(i: number, j: number) {
  // Make it take a while
  let sum = 0;
  for (let k = 0; k < 100_000_000; k++) {
    sum += k;
  }

  return i + j + sum;
}

function Component() {
  let [i, setI] = useState(0);
  let [j, setJ] = useState(0);

  let k = computeComplexMathProblem(i, j);

  return <>
    Hi, {i}, {j} = {k}
  </>

}

export default function Home() {
  return (
    <Component></Component>
  );
}
