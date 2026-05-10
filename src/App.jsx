import { useEffect, useRef, useState } from 'react'
import './App.css'
import { PauseIcon, PlayIcon, RotateCcwIcon } from 'lucide-react'
import { StageIndicator } from './components/StageIndicator';

const WORK_TIME = 25 * 60;
const REST_TIME = 5 * 60;

function secondsToText(seconds) {
  const min = ('0' + ((seconds - (seconds % 60)) / 60).toString()).slice(-2);
  const sec = ('0' + (seconds % 60).toString()).slice(-2);
  return `${min}:${sec}`;
}

function App() {
  const timerId = useRef(null);

  const [timer, setTimer] = useState({
    text: secondsToText(WORK_TIME),
    seconds: WORK_TIME,
  });

  const [timerState, setTimerState] = useState('pause');
  const [timerStage, setTimerStage] = useState('work');
  const [iteration, setIteration] = useState(1);

  function play() {
    if (status.state === 'play') return;
    setTimerState('play');
  }

  function pause() {
    if (timerState.state === 'pause') return;
    setTimerState('pause');
  }

  function reset() {
    setTimerState('pause');
    const seconds = timerStage === 'work' ? WORK_TIME : REST_TIME;
    setTimer({
      seconds,
      text: secondsToText(seconds),
    });
  }

  useEffect(() => {
    if (timerState !== 'play') return;
    timerId.current = setInterval(() => {
      setTimer((prev) => {
        const seconds = prev.seconds - 1;

        if (seconds === 0) {
          const newStageSeconds = timerStage === 'work' ? REST_TIME : WORK_TIME;
          if (iteration > 3) setIteration(1);
          if (timerStage === 'work') setIteration(iteration + 1);
          console.log(iteration);

          setTimerStage(timerStage === 'work' ? 'rest' : 'work')


          return {
            seconds: newStageSeconds * (iteration === 3 && timerStage === 'work' ? 3 : 1),
            text: secondsToText(newStageSeconds * (iteration === 3 && timerStage === 'work' ? 3 : 1)),
          }
        }

        return {
          seconds,
          text: secondsToText(seconds),
        }
      });
    }, 1000);

    return () => {
      if (!timerId.current) return;
      clearInterval(timerId.current);
    };
  }, [play, pause, reset]);

  useEffect(() => {
    reset();
  }, []);

  function onActionClick() {
    if (timerState === 'play') {
      pause();
    } else {
      play();
    }
  }

  function onResetClick() {
    reset();
  }

  return (
    <div className={`app ${timerStage === 'work' ? '' : 'rest'}`}>
      <div className={`clouds ${timerStage === 'work' ? '' : 'shown'}`}>
        <div className="cloud cloud1"></div>
        <div className="cloud cloud2"></div>
        <div className="cloud cloud3"></div>
      </div>

      <div className="main">
        <StageIndicator stage={timerStage} />

        <h1 className={`time ${timerStage}`}>
          {timer.text}
        </h1>

        <div className="buttons">
          <button className='button action' onClick={onActionClick}>
            <div className="button-icon">
              {
                timerState === 'play'
                  ? <PauseIcon size={16} />
                  : <PlayIcon size={16} />
              }
            </div>

            {
              timerState === 'play'
                ? 'Пауза'
                : 'Старт'
            }
          </button>

          <button className='button reset' onClick={onResetClick}>
            <div className="button-icon">
              <RotateCcwIcon size={16} />
            </div>

            Сбросить
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
