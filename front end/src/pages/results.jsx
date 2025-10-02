// src/pages/results.jsx
import { useLocation, Link } from "react-router-dom";


export default function Results() {
  // obtaining variables state's
  const { state } = useLocation();
  const correct = state?.correct ?? 0;
  const incorrect = state?.incorrect ?? 0;


  return (
    <div className="my-box">
      <h1>Results</h1>
      <p>Correct: {correct}</p>
      <p>Incorrect: {incorrect}</p>
    </div>
  );
}
