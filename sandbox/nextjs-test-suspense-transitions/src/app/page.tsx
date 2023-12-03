import { Suspense, useEffect } from "react";
import ClientComponent from "./client";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function DelayedText({ delay }: { delay: number }) {
  await wait(delay);
  return <p>delay</p>;
}



export default async function Home() {

  return (
    <main>
      Hello
      <ClientComponent></ClientComponent>
      <Suspense>
        <DelayedText delay={1000}></DelayedText>
      </Suspense>
      <Suspense>
        <DelayedText delay={3000}></DelayedText>
      </Suspense>
      <Suspense>
        <DelayedText delay={10000}></DelayedText>
      </Suspense>
    </main>
  )
}
