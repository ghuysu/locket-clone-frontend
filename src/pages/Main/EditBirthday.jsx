import { useState, useRef, useEffect } from 'react'
import Button from '../../components/Button'
import { DatePicker } from "@nextui-org/react"
import {parseDate} from "@internationalized/date";
import gsap from 'gsap'

const getDate = ({day, month, year}) => {
  if (day.toString().length === 1){
    day = "0" + day.toString()
  }
  if (month.toString().length === 1){
    month = "0" + month.toString()
  }
  return `${day}/${month}/${year}`
}

const changeFormatBirthday = ({day, month, year}) => {
  return `${year}-${month}-${day}`
}

export default function EditBirthday ({user, setUser, signInKey}) {
  const oldBirthday = {
    day: user.birthday.split("/")[0],
    month: user.birthday.split("/")[1],
    year: user.birthday.split("/")[2]
  }
  const [birthday, setBirthday] = useState(parseDate(changeFormatBirthday(oldBirthday)))
  const [isValid, setIsValid] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const contentRef = useRef(null)

  useEffect(() => {
    const content = contentRef.current
    gsap.fromTo(content, { opacity: 0 }, { opacity: 1, duration: 1})
  }, [])

  useEffect(() => {
    if (birthday !== null && birthday.year < new Date().getFullYear() && birthday.year > 1950 && getDate(birthday) !== user.birthday) {
      setIsValid(true)
    } else {
      setIsValid(false)
    }
  }, [birthday])

  const handleClick = async () => {
    setIsLoading(true)
    setError('')
    try {
      const response = await fetch(
        'https://skn7vgp9-9876.asse.devtunnels.ms/account/birthday',
        {
          method: 'PATCH',
          headers: {
            'api-key': 'ABC-XYZ-WWW',
            'Content-Type': 'application/json',
            'authorization': signInKey,
            'user-id': user?._id
          },
          body: JSON.stringify({
            birthday: getDate(birthday)
          }),
        }
      )
      const data = await response.json()
      if (!response.ok) {
        if (data.message === 'API key is required') {
          setError('API key is required.')
        } else if (data.message === 'API key is incorrect') {
          setError('API key is incorrect.')
        } else if (data.message === 'Birthday is required') {
          setError('Birthday is required.')
        } else {
          setError('An unknown error occurred.')
        }
      } else {
        setUser(data.metadata)
      }
    } catch (error) {
      console.error('Error:', error)
      setError('Failed to sign up. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center bg-transparent" style={{ height: 'calc(100vh - 64px)' }}>
      <div ref={contentRef} className='bg-black w-[500px] h-[400px] p-8 rounded-3xl shadow-2xl border-t-4 border-yellow-500 flex flex-col justify-center items-center'>
        <p className="bold text-2xl pb-7 text-yellow-500">What's your birthday?</p>
        <div className="mt-2 relative">
          <DatePicker
            value={birthday}
            onChange={setBirthday}
            className="bg-[#29282C] text-sm text-gray rounded-2xl p-3 w-80 focus:outline-none focus:ring-2 flex items-center justify-center"
          />
          <div className='absolute bg-[#29282C] w-6 h-6 top-4 right-8'></div>
          <p className="pt-2 text-xs text-zinc-600 pb-3">Please notice that birthday use mm/dd/yyyy format!</p>
        </div>
        <div className="pt-8 flex justify-center space-x-4">
          <Button
              text={isLoading ? 'Processing...' : 'Save your birthday'}
              handleClick={(!isLoading && isValid) ? handleClick : ()=>{}}
              isActive={(!isLoading && isValid) ? true : false}
          />
        </div>
        {error && <p className="text-xs text-red-500 pt-4">{error}</p>}
      </div>
    </div>
  )
}
