import { useState, useCallback } from 'react'
import Landing from './components/Landing/Landing'
import Setup from './components/Setup/Setup'
import InterviewRoom from './components/InterviewRoom/InterviewRoom'
import Scoring from './components/Scoring/Scoring'
import Learn from './components/Learn/Learn'


const PAGES = {
  LANDING: 'landing',
  SETUP: 'setup',
  INTERVIEW: 'interview',
  SCORING: 'scoring',
  LEARN: 'learn',
}

export default function App() {
  const [page, setPage] = useState(PAGES.LANDING)
  const [interviewConfig, setInterviewConfig] = useState(null)
  const [interviewResult, setInterviewResult] = useState(null)

  const goToSetup = useCallback(() => setPage(PAGES.SETUP), [])
  const goToLanding = useCallback(() => setPage(PAGES.LANDING), [])
  const goToLearn = useCallback(() => setPage(PAGES.LEARN), [])

  const startInterview = useCallback((config) => {
    setInterviewConfig(config)
    setPage(PAGES.INTERVIEW)
  }, [])

  const finishInterview = useCallback((result) => {
    setInterviewResult(result)
    setPage(PAGES.SCORING)
  }, [])

  const startNew = useCallback(() => {
    setInterviewConfig(null)
    setInterviewResult(null)
    setPage(PAGES.SETUP)
  }, [])



  return (
    <>
      {page === PAGES.LANDING && (
        <Landing
          onStart={goToSetup}
          onLearn={goToLearn}
          onDashboard={() => setPage(PAGES.LANDING)} // Or whatever dashboard page exists
        />
      )}
      {page === PAGES.SETUP && <Setup onStart={startInterview} onBack={goToLanding} />}
      {page === PAGES.INTERVIEW && (
        <InterviewRoom config={interviewConfig} onFinish={finishInterview} onExit={goToLanding} />
      )}
      {page === PAGES.SCORING && (
        <Scoring result={interviewResult} config={interviewConfig} onNewInterview={startNew} onHome={goToLanding} />
      )}
      {page === PAGES.LEARN && <Learn onBack={goToLanding} onStartInterview={startInterview} />}
    </>
  )
}

