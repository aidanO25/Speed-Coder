// src/pages/typingTest.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom"; //page navigation capability
/* ---------------- Typing Test Page ---------------- */
export default function TypingTest() {
  // for navigation to results
  const navigate = useNavigate()

  // hold snipet + loading/error
  const [snippet, setSnippet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null); 

  // use the fetched snippet as the target text the user must type
  let targetText = "";
  if (snippet && snippet.snippet) {
    targetText = snippet.snippet;
  } else {
    if (loading) {
      targetText = "Loading...";
    } else {
      targetText = "No snippet";
    }
  }
  const chars = useMemo(
    () => targetText.split(""), // splits targetText into an array of characters
    [targetText]                // chars only recalculates if targetText changes
  );

  /* State hooks (React remembers these between re-renders)
     const [value, setValue] = useState(initialValue);
  */
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typed, setTyped] = useState([]);
  const [totalChars, setTotalChars] = useState(0);

  //funciton to fetch a code snippet
  async function loadSnippet() {
    try {
      setLoading(true);
      setErr(null);
      const res = await fetch("http://127.0.0.1:8000/snippets/random");
      if (!res.ok) throw new Error("Failed to fetch snippet");
      const data = await res.json();       // { id, language, content }
      setSnippet(data);
      // reset typing state for the new text
      setTyped([]);
      setCurrentIndex(0);
      setTotalChars(data.snippet.length); 
    } 
    catch (e) 
    {
      console.error(e);
      setErr(String(e));
    } finally {
      setLoading(false);
    }

  
    
  }

  /*
    - This is where we are going to attempt to build a funciton to retieve information 
      about the number of correct and incorrect characters
    - ----------

    async function loadCorrect() {
      try { // This allows us to catch a load/fetch err
        setLoading(true)
      }
    }
  */

    // fetch once on mount
  useEffect(() => { loadSnippet(); }, []);


  // logic for deciding what char the user is on, and if they got it correct or incorrect
  // Runs after React renders; effect re-runs when [currentIndex, chars.length] change
  useEffect(() => {
    function onKeyDown(e) {
      if (loading || err || !snippet) return;

      // stop the page from scrolling on these keys
      const scrollKeys = new Set([
        " ",             // Space (still want to type it)
        "ArrowUp",
        "ArrowDown",
        "PageUp",
        "PageDown",
        "Home",
        "End"
      ]);
      if (scrollKeys.has(e.key)) e.preventDefault();

      // handle Backspace
      if (e.key === "Backspace") {
        if (currentIndex > 0) {
          e.preventDefault();
          setTyped((prev) => prev.slice(0, -1)); // remove last typed char
          setCurrentIndex((i) => i - 1);         // move back one index
        }
        return;
      }

      // handle normal typing
      if (e.key.length !== 1) return;           // ignore non-printing keys
      if (currentIndex >= chars.length) return; // already finished

      setTyped((prev) => [...prev, e.key]);

      if (currentIndex === chars.length - 1) {
        setCurrentIndex((i) => i + 1); // advance past last char

        setTimeout(() => {
          // navigate to /signIn and pass results along (done using "state")
          navigate("/results", {
            state: {
              correct: correctlyTyped,
              incorrect: incorrectlyTyped,
            },
          });
        }, 0);
      } else {
        setCurrentIndex((i) => i + 1);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [currentIndex, chars.length, loading, err, snippet]);

  let correctlyTyped = 0
  let incorrectlyTyped = 0;

  for (let i = 0; i < typed.length; i++) {
    if (typed[i] == chars[i]) {
      correctlyTyped ++;
    }
    else{
      incorrectlyTyped ++;
    }
  }
  // this could also be done like:
  /*
    const correctlyTyped = typed.filter((t, i) => t === chars[i]).length;
    const incorrectlyTyped = typed.filter((t, i) => t !== chars[i]).length;
  */
 // may be more usefull with constants and better practice



  /*
    - re-render UI
    - map over each character and render it as a <span>
    - className changes based on state (current, correct, incorrect)
    - React re-renders when `typed` or `currentIndex` change
  */

  return (
    <>
      <h1>Coding Speed Test</h1>

      <button onClick={loadSnippet} disabled={loading} style={{ marginBottom: 12 }}>
        {loading ? "Loading…" : "New Snippet"}
      </button>

      <div style={{ marginBottom: 12 }}>
        Total Characters: {totalChars}
        <br />
        Correct: {correctlyTyped}
        <br />
        Incorrect: {incorrectlyTyped}
      </div>

      <div className="my-box">
        {chars.map((char, i) => {
          let cls = "";
          if (i === currentIndex) {
            cls = "current";
          } else if (typed[i] !== undefined) {
            cls = typed[i] === char ? "correct" : "incorrect";
          }
          return (
            <span key={i} className={cls}>
              {char}
            </span>
          );
        })}
      </div>

      {err && <div style={{ marginTop: 8, color: "red" }}>{err}</div>}
    </>
  );
}