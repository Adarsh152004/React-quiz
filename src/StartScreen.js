import { useState } from "react";

function StartScreen({topics, dispatch, highscore, totalQuestionNum}) {
    const [selectedTopic, setSelectedTopic] = useState(null);

    const numQuestions = selectedTopic ? selectedTopic.questions.length : 0;

    return (
        <div >
            <h2 className="welcome">Welcome to the mern quiz</h2>
            <h3>{selectedTopic ? numQuestions : totalQuestionNum} questions to test your skills</h3>
        <div className="grid-container">
            {topics.map(topic => (
            <div key={topic.topic}>
                <button onClick={() => setSelectedTopic(topic)} className="btn-topic grid-item"><span>{topic.topic}</span></button>
            </div>
        ))}
        </div>
        {selectedTopic && (
            <button disabled={!selectedTopic} onClick={() => dispatch({ type: 'start', payload: selectedTopic})} className="btn-startGame">Let's start</button>)}
        </div>
    )
}

export default StartScreen;
