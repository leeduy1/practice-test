import React, { useState, useEffect, useRef } from "react";

interface ICircle {
  value: number;
  top: number;
  left: number;
  clicked: boolean;
}

const App: React.FC = () => {
  const [points, setPoints] = useState<number>(3);
  const [circles, setCircles] = useState<ICircle[]>([]);
  const [time, setTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [nextValue, setNextValue] = useState<number>(1);
  const [gameStatus, setGameStatus] = useState<string>("LET'S PLAY");
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [noTransition, setNoTransition] = useState<boolean>(true);
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  const startGame = () => {
    setIsStarted(true);
    reset();
  };

  const reset = () => {
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];

    const newCircles: ICircle[] = [];
    for (let i = 1; i <= points; i++) {
      const circle: ICircle = {
        value: i,
        top: Math.random() * 342,
        left: Math.random() * 342,
        clicked: false,
      };
      newCircles.push(circle);
    }

    setCircles(newCircles);
    setTime(0);
    setGameStatus("LET'S PLAY");
    setIsRunning(true);
    setNextValue(1);
    setNoTransition(true);

    setTimeout(() => {
      setNoTransition(false);
    }, 100);
  };

  const handleCircleClick = (value: number) => {
    if (value === nextValue) {
      setCircles((prevCircles) =>
        prevCircles.map((circle) =>
          circle.value === value ? { ...circle, clicked: true } : circle
        )
      );
      const timeoutId = setTimeout(() => {
        setCircles((prevCircles) =>
          prevCircles.filter((circle) => circle.value !== value)
        );

        if (value === points) {
          setGameStatus("ALL CLEARED");
          setIsRunning(false);
        }
      }, 1500);
      timeoutRefs.current.push(timeoutId);
      setNextValue(nextValue + 1);
    } else {
      setGameStatus("GAME OVER");
      setIsRunning(false);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 0.1);
      }, 100);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  return (
    <div className="ml-6">
      <h1
        className={`text-2xl font-bold mt-10 mb-2 ${
          gameStatus === "ALL CLEARED"
            ? "text-green-500"
            : gameStatus === "GAME OVER"
            ? "text-red-500"
            : ""
        }`}
      >
        {gameStatus}
      </h1>
      <div className="mb-2">
        <label htmlFor="points" className="mr-16">
          Points:
        </label>
        <input
          id="points"
          type="number"
          className="pl-1 border border-slate-700"
          value={points}
          onChange={(e) => setPoints(Number(e.target.value))}
        />
      </div>
      <div className="mb-2">
        <span className="mr-[70px]">Time: </span>
        <span>{time.toFixed(1)}s </span>
      </div>
      <button
        className="rounded bg-slate-400 py-1 px-6 mb-4"
        onClick={isStarted ? reset : startGame}
      >
        {isStarted ? "Restart" : "Play"}
      </button>
      <div className="w-96 h-96 border border-slate-700 relative">
        {circles.map((circle) => (
          <button
            key={circle.value}
            className={`absolute w-10 h-10 border border-slate-700 rounded-full flex items-center justify-center ${
              circle.clicked ? "bg-red-500" : "bg-white"
            } ${
              noTransition ? "transition-none" : "transition-all duration-1000"
            }`}
            style={{
              top: circle.top,
              left: circle.left,
              zIndex: points - circle.value + 1,
            }}
            onClick={() => handleCircleClick(circle.value)}
            disabled={circle.clicked}
          >
            <span className="text-xl">{circle.value}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default App;
