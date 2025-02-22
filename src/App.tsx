import { useBasic, useQuery } from '@basictech/react'
import './App.css'


function App() {
  const { db, user, signin } = useBasic()
  const emojis = useQuery(() => db.collection('location').getAll())

  return <>
    {user?.name}
    <button onClick={() => signin()}>Sign in</button>
  </>
}

export default App
