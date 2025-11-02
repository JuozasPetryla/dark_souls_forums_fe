import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0);

  const toggleTheme = () => {
    const html = document.documentElement;
    html.dataset.theme =
      html.dataset.theme === "dark" ? "light" : "dark";
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow-md px-6">
        <div className="flex-1">
          <a className="text-xl font-bold text-primary">daisyUI App 🌼</a>
        </div>
        <div className="flex-none">
          <button className="btn btn-ghost" onClick={toggleTheme}>
            Toggle Theme
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center h-[80vh]">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body items-center text-center">
            <h2 className="card-title">Counter Component</h2>
            <p className="text-base-content">
              Click the button to increase the count!
            </p>
            <div className="card-actions mt-4 flex flex-col gap-2">
              <button
                className="btn btn-primary w-full"
                onClick={() => setCount((prev) => prev + 1)}
              >
                Count: {count}
              </button>
              <button
                className="btn btn-outline w-full"
                onClick={() => setCount(0)}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App
