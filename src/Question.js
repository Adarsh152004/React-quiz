import Loader from "./Loader"
import Options from "./Options"

function Question({questions, dispatch, answer, status}) {
    return (  
        <div>

        {status === 'loading' && <Loader />}
            <h4>{questions.question}</h4>
            <Options questions={questions} dispatch={dispatch} answer={answer} status={status} />
        </div>
    )
}

export default Question
