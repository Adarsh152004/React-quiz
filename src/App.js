import { useEffect, useReducer, useState } from "react";

import Header from './Header'
import Loader  from './Loader'
import Error from './Error'
import Main from './Main'
import StartScreen from './StartScreen';
import Question from "./Question";
import Footer from './Footer';
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Timer from "./Timer";

const SECS_FOR_QUESTION = 30;

const initialState = {
  questions: [],
  topics: [],
  answer: null,
  index: 9,
  highscore: 0,
  points: 0,
  status: 'loading',
  secondsRemaining: null,
}

function reducer(state, action) {
  switch(action.type) {
    case 'dataReceived': 
      return {
        ...state,
        status: 'ready',
        topics: action.payload,
        questions: action.payload.flatMap(topic => topic.questions),
      };
    case 'dataFailed': 
      return {
        ...state,
        status: 'error',
      }
    case 'start': 
      return {
        ...state,
        status: 'active',
        questions: action.payload.questions,
        secondsRemaining: state.questions.length * SECS_FOR_QUESTION,
      }
    case 'newAnswer': 
       const question = state.questions.at(state.index);
       const isCorrect = action.payload === question.correctOption;
      return {
        ...state,
        answer: action.payload,
        points: isCorrect ? state.points + question.points : state.points,   
      }
    case 'nextQuestion': 
      return {
        ...state,
        index: state.index + 1,
        answer: null,
      }
    case 'finish':
      const highscore = state.points > state.highscore ? state.points : state.highscore;
      return {
        ...state,
        status: 'finished',
        highscore,
      }
    case 'reset': 
      return {
        ...state,
        questions: state.questions,
        highscore: state.highscore,
        status: 'ready'
      }
    case 'tick': 
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? 'finished' : state.status,
      }
    default:
      return state;
  }
}


function App() {
  const [{questions, topics, status, index, points, highscore, answer, secondsRemaining}, dispatch] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce((prev, curr) => prev + curr.points, 0);


  useEffect(() => {
    fetch('http://localhost:8000/topics')
      .then(res => res.json())
      .then(data => {
        console.log('Fetched topics:', data);
        dispatch({ type: 'dataReceived', payload: data});
      })
      .catch((err) => dispatch({ type: 'dataFailed' }));
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
      {status === 'loading' && <Loader />}
      {status === 'error' && <Error />}
      {status === 'ready' && (
        <StartScreen totalQuestionNum={questions.length} topics={topics} dispatch={dispatch} highscore={highscore}/>
      )}

      {status === 'active' && (
        <>
        <Progress points={points} numQuestions={numQuestions} maxPossiblePoints={maxPossiblePoints} answer={answer} index={index} />
        <Question questions={questions[index]} dispatch={dispatch} answer={answer} status={status}/>

      <Footer>
        <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
        <NextButton numQuestions={numQuestions} dispatch={dispatch} index={index} answer={answer} status={status}/>
      </Footer>
    </>
      )}

    {status === 'finished' && (
      <FinishScreen points={points} maxPossiblePoints={maxPossiblePoints} highscore={highscore} dispatch={dispatch} />
    )}

      </Main>
    </div>
  );
}

export default App;
