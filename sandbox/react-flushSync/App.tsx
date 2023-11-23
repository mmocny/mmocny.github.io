import React, { Suspense, useState, useRef, useLayoutEffect, forwardRef, use, cache } from "react";
import { EditableText } from "./EditableText";
import { Echo } from "./Echo";

function delay(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

const NestedTest = forwardRef(function NestedTest({}, ref ) {
  use(cache(delay)(1000));

  return <div ref={ref}>NestedTest</div>;
});

function Test() {
  const ref = useRef(null);

  useLayoutEffect(() => {
    console.log(ref.current);
  }, []);

  return <NestedTest ref={ref} />;
}

function App() {
  const [fname, setFName] = useState("Michal");
  const [lname, setLName] = useState("Mocny");

  // return <Test></Test>;
  return (
    <>
      First Name: <EditableText text={fname} setText={setFName}></EditableText>
      Surname: <EditableText text={lname} setText={setLName}></EditableText>
      <hr />
      Name:{" "}
      <Suspense>
        <Echo text={fname + " " + lname} /> 
      </Suspense>
    </>
  );
}

export default App;
