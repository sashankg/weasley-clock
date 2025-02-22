import { useBasic, useQuery } from '@basictech/react'
import './App.css'
import { useEffect, useState, useMemo, useCallback, FormEvent } from 'react'
import {getBearerTokenFromCookie} from './token.ts'
import {getLocation, getPlaces } from './others.ts'
import { useWindowSize } from '@react-hook/window-size'


// https://sashank-gogula.dwelf-mirzam.ts.net/

type Loc = {
  name: string
  lat: number
  long: number
}

// const dummyPlaces = [
//   { name: 'home', lat: 100, long: 200 }, 
//   { name: 'work', lat: 300, long: 100 }, 
//   { name: 'store', lat: 0, long: 300 }
// ]

// const dummyLocations = [{ name: "arushi", lat: 100, long: 200 }, {name: "a different arushi", lat: 0, lo: 300 }]

const emptyArray: any[] = []

function App() {
  const { db, user, signin, isSignedIn, signout, dbStatus } = useBasic()
  const log = useQuery(() => db.collection('log').getAll())
  const places = useQuery(() => db.collection('places').getAll()) ?? emptyArray
  const friends = useQuery(() => db.collection('friends').getAll()) ?? emptyArray

  const [friendsLocations, setFriendsLocations] = useState<Loc[]>([])
  const [friendsPlaces, setFriendsPlaces] = useState<Loc[]>([])

  const allPlaces = useMemo(() => [...places, ...friendsPlaces], [places, friendsPlaces])
  const allLocations = useMemo(() => {
    if (!log || log.length == 0) {
      return []
    }
    const currentLoc = log[log.length - 1]
    return [{
      name: user?.name,
      lat: currentLoc.lat,
      long: currentLoc.long,
    }, ...friendsLocations]
  }, [log, friendsLocations, user?.name])
  
  console.log("all locations", allLocations)
  console.log("all places", allPlaces)

  useEffect(() => {
    friends?.forEach((friend: any) => {
      setFriendsLocations([])
      setFriendsPlaces([])
      getPlaces(friend.token).then((places: any[]) => places && setFriendsPlaces(o => o.concat(places.map(p => ({
        name: p.value.name,
        lat: p.value.lat,
        long: p.value.long,
      })))))
      getLocation(friend.token).then(locs => locs && setFriendsLocations((o) => {
        const loc = locs[locs.length - 1]
        return ([...o, {
          name: friend.name,
          lat: loc.value.lat,
          long: loc.value.long,
        }])
      }))
    })
  }, [friends, setFriendsLocations, setFriendsPlaces])

  const [width, height] = useWindowSize()
  const radius = Math.min(width, height) / 2 - 60;

  console.log("places", places)
  console.log("friends", friends)
  console.log("log", log)
  
  const token = useMemo(() => isSignedIn ? getBearerTokenFromCookie() : undefined, [isSignedIn])
  
  const [nameBox, setNameBox] = useState<string>("")
  const [tokenBox, setTokenBox] = useState<string>("")
  const [placeBox, setPlaceBox] = useState<string>("")
  const [latBox, setLatBox] = useState<string>()
  const [longBox, setLongBox] = useState<string>()


  useEffect(() => {
    console.log("user is ", user?.email, user?.fullName, user?.id)
    const watchId = navigator.geolocation.watchPosition((position) => {
      console.log('position', position)
      db.collection('log').add({
        lat: position.coords.latitude,
        long: position.coords.longitude,
      })
    })
    return () => {
      navigator.geolocation.clearWatch(watchId)
    }
  }, [])

  const addFriendToken = useCallback((e: FormEvent) => {
    e.preventDefault();
    // todo: make sure not already friend
    db.collection('friends').add({
      token: tokenBox,
      name: nameBox,
    })
    setTokenBox("")
    setNameBox("")
  }, [tokenBox, setTokenBox, nameBox, setNameBox])

  const addPlace = useCallback((e: FormEvent) => {
    e.preventDefault();
    if (!latBox || !longBox) {
      navigator.geolocation.getCurrentPosition((position) => {
        if (placeBox != "") {
          db.collection('places').add({
            name: placeBox,
            lat: position.coords.latitude,
            long: position.coords.longitude,
          })
        }
      })
    } else {
      db.collection('places').add({
        name: placeBox,
        lat: Number(latBox),
        long: Number(longBox),
      })
    }
    setPlaceBox("")
    setLatBox("")
    setLongBox("")
  }, [placeBox, setPlaceBox, latBox, setLatBox, longBox, setLongBox])

  if (!isSignedIn || !user) {
    return <button onClick={() => signin()}>Sign In</button> 
  }

  return (
    <div style={{  height: '100vh', width: '100vw', padding: 24 } } >
      <div style={{ background: 'url(/face.svg)', backgroundRepeat: 'no-repeat', height: '100%', width: '100%', backgroundSize: 'contain', backgroundPosition: 'center'} } >
      <div style={{position: 'absolute', height: '100%', width: '100%', top: 0, left: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      {allPlaces.map(({ name }, i) => {
        const angleStep = (2 * Math.PI) / allPlaces.length;
        const angle = i * angleStep;

        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        return (
          <div key={name} style={{ transform: `translate(${x}px, ${y}px)`, position: 'absolute'}}>
            {name}
          </div>
        )

      })}
      {allLocations.map(({ lat, long, name }, i) => {
        let closestPlaceIndex = 0 
        let closestDistance = Infinity
        allPlaces.forEach(({ lat: lat2, long: long2 }, j) => {
          const distance = Math.sqrt((lat - lat2) ** 2 + (long - long2) ** 2)
          console.log(lat, long, lat2, long2, distance)
          if (distance < closestDistance) {
            closestDistance = distance
            closestPlaceIndex = j
          }
        })
        return <div key={i} style={{position: 'absolute', width: '100%', height: '100%', top: 0, opacity: 0.8, left: 0, transform: `rotate(${2 * Math.PI * (closestPlaceIndex / allPlaces.length) + Math.PI / 2 + Math.random() - 0.5}rad)`, transition:'transform 1s', pointerEvents: 'none' }}>
        <img key={i} src='/hand.svg' style={{position: 'absolute', height: `${radius * 2 - 100}px`, top: '50%', left: '50%', transform: `translate(-50%, -50%)` }} />
        <div style={{position: 'absolute', top: '50%', color: '#A4031F', left: '50%', transform: `translate(-50%, ${-radius + 80}px)` }}><b>{name}</b></div>
          </div>
        
      })}
      </div>
      </div>
      <button onClick={() => navigator.clipboard.writeText(token!)}>Copy my token</button>
      <form onSubmit={addFriendToken}>
        <label>
          Add a friend
          <input className='ml-2' type='text' placeholder='token' value={tokenBox} onChange={({target}) => setTokenBox(target.value)}/>
          <input className='ml-2' type='text' placeholder='name' value={nameBox} onChange={({target}) => setNameBox(target.value)}/>
        </label>
        <button type='submit'>Submit</button>
      </form>
      <form onSubmit={addPlace}>
        <label>
          Add place
          <input className='ml-2' type='text' placeholder='name' value={placeBox} onChange={({target}) => setPlaceBox(target.value)}/>
          <input className='ml-2' type='string' placeholder='latitude' value={latBox} onChange={({target}) => setLatBox(target.value)}/>
          <input className='ml-2' type='string' placeholder='longitude' value={longBox} onChange={({target}) => setLongBox(target.value)}/>
        </label>
        <button type='submit'>Submit</button>
      </form>
      <button onClick={() => signout()}>Sign Out</button>
    </div>
  )
}

export default App