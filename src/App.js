import React, { useState, useRef, useEffect } from 'react'
import './App.css';

const getCloud = () => `paragraph is a series of sentences that are organized and coherent and
 are all related to a single topic Almost every piece of writing you do that is longer than a few
sentences should be organized into paragraphs`.split(' ')


const Word = props => {

  const { text, active, correct } = props

  if (correct === true) {
    return <span className="correct">{text} </span>
  }

  if (correct === false) {
    return <span className="incorrect">{text} </span>
  }

  if (active) {
    return <span className="active">{text} </span>
  }

  return <span>{text} </span>
}



const Timer = (props) => {

  const { correctWords, startCounting } = props
  const [timeElapsed, setTimeElapsed] = useState(0)

  useEffect(() => {
    let id
    if (startCounting) {
      id = setInterval(() => {
        setTimeElapsed(oldTime => oldTime + 1)
      }, 1000)
    }

    return () => {
      clearInterval(id)
    }
  }, [startCounting])

  const minutes = timeElapsed / 60

  return <div>
    <p>Timer: {timeElapsed}</p>
    <p>Speed: {((correctWords / { minutes }) || 0).toFixed(2)}WPM</p>
  </div>
}



const App = () => {
  const [userInput, setUserInput] = useState('')
  const cloud = useRef(getCloud())

  const [startCounting, setStartCounting] = useState(false)

  const [activeWordIndex, setActiveWordIndex] = useState(0)
  const [correctWordArray, setCorrectWordArray] = useState([])

  const processInput = (value) => {

    if (!startCounting) {
      setStartCounting(true)
    }


    if (value.endsWith(' ')) {

      if (activeWordIndex === cloud.current.length) {
        setStartCounting(false)
        setUserInput('completed')

      }

      setActiveWordIndex(index => index + 1)
      setUserInput('')

      setCorrectWordArray(data => {
        const word = value.trim()
        const newResult = [...data]
        newResult[activeWordIndex] = word === cloud.current[activeWordIndex]
        return newResult
      })

    } else {
      setUserInput(value)
    }
  }

  return (
    <div className="container">
      <h1>Typing Test</h1>
      <Timer startCounting={startCounting}
        correctWords={correctWordArray.filter(Boolean).length}

      />


      <p>{cloud.current.map((word, index) => {
        return <Word
          text={word}
          correct={correctWordArray[index]}
          active={index === activeWordIndex}
        />

      })}</p>
      <input type="text" value={userInput}
        placeholder='start typing...'
        onChange={(e) => processInput(e.target.value)} />

    </div>
  );
}

export default App;
