import { useState, useRef, useEffect } from 'react'
import Logo from '../../components/Logo'
import PasswordInput from "../../components/PasswordInput"
import Input from '../../components/Input'
import Button from '../../components/Button'
import { DatePicker } from "@nextui-org/react"
import gsap from 'gsap'

const validatePassword = (password) => {
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=.{8,})/
  return regex.test(password)
}

const getDate = ({day, month, year}) => {
  if (day.toString().length === 1){
    day = "0" + day.toString()
  }
  if (month.toString().length === 1){
    month = "0" + month.toString()
  }
  return `${day}/${month}/${year}`
}

const Infor = ({ verifiedEmail, setPage }) => {
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [password, setPassword] = useState('')
  const [birthday, setBirthday] = useState(null)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isValid, setIsValid] = useState(false)
  const [error, setError] = useState('')
  const [isSuccessfully, setIsSuccessfully] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const contentRef = useRef(null)

  useEffect(() => {
    const content = contentRef.current
    gsap.fromTo(content, { opacity: 0 }, { opacity: 1, duration: 1, delay: 1 })
  }, [])

  const checkValid = () => {
    if (
      firstname.length !== 0 &&
      lastname.length !== 0 &&
      birthday !== null &&
      validatePassword(password) &&
      password === confirmPassword
    ) {
      setIsValid(true)
    } else {
      setIsValid(false)
    }
  }

  useEffect(() => {
    checkValid()
  }, [firstname, lastname, password, confirmPassword, birthday])

  const handleFirstnameChange = (event) => {
    setFirstname(event.target.value)
  }

  const handleLastnameChange = (event) => {
    setLastname(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value)
  }

  const handleClick = async () => {
    setIsLoading(true)
    setError('')
    try {
      const response = await fetch(
        'https://skn7vgp9-9876.asse.devtunnels.ms/access/sign-up',
        {
          method: 'POST',
          headers: {
            'api-key': 'ABC-XYZ-WWW',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: verifiedEmail,
            firstname: firstname,
            lastname: lastname,
            birthday: getDate(birthday),
            password: password,
          }),
        }
      )
      const data = await response.json()
      if (!response.ok) {
        if (data.message === 'API key is required') {
          setError('API key is required.')
        } else if (data.message === 'API key is incorrect') {
          setError('API key is incorrect.')
        } else if (data.message === 'Data is invalid') {
          setError('Data is invalid.')
        } else if (data.message === 'New password does not meet requirements') {
          setError('Your password does not meet requirements.')
        } else {
          setError('An unknown error occurred.')
        }
        setIsSuccessfully(false)
      } else {
        setIsSuccessfully(true)
        setTimeout(() => {
          setPage('signin')
        }, 2000)
      }
    } catch (error) {
      console.error('Error:', error)
      setError('Failed to sign up. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-black flex flex-col w-full pt-10 border-t-4 border-yellow-500 rounded-lg">
      <Logo />
      <div
        ref={contentRef}
        className="pt-16 flex flex-col items-center justify-center"
      >
        <p className="bold text-2xl pb-7 text-gray">We need your information!</p>
        <div className="mt-2">
          <p className="text-left text-gray text-sm ml-2 pb-1">Firstname</p>
          <Input
            text={'Firstname'}
            handleChange={handleFirstnameChange}
            name={'firstname'}
            value={firstname}
          />
        </div>
        <div className="mt-2">
          <p className="text-left text-gray text-sm ml-2 pb-1">Lastname</p>
          <Input
            text={'Lastname'}
            handleChange={handleLastnameChange}
            name={'lastname'}
            value={lastname}
          />
        </div>
        <div className="mt-2 relative">
          <p className="text-left text-gray text-sm ml-2 pb-1">Birthday</p>
          <DatePicker
            value={birthday} onChange={setBirthday} className="bg-[#29282C] text-sm text-gray rounded-2xl p-3 w-80 focus:outline-none focus:ring-2"
          />
          <div className='absolute bg-[#29282C] w-6 h-6 top-10 right-8'></div>
          <p className="pt-2 text-xs text-zinc-600 pb-3">Please notice that birthday use mm/dd/yyyy format!</p>
        </div>

        <div className="mt-2">
          <p className="text-left text-gray text-sm ml-2 pb-1">Password</p>
          <PasswordInput
            text={'Password'}
            handleChange={handlePasswordChange}
            name={'password'}
            value={password}
          />
        </div>
        <div className="mt-2">
          <p className="text-left text-gray text-sm ml-2 pb-1">Confirm password</p>
          <PasswordInput
            text={'Confirm password'}
            handleChange={handleConfirmPasswordChange}
            name={'confirmPassword'}
            value={confirmPassword}
          />
        </div>
        <p className="pt-3 text-xs text-zinc-600 pb-10">
          Your password must have at least 8 characters, including <br />
          <span className="text-zinc-400">special characters</span>,{' '}
          <span className="text-zinc-400">capital letters</span>, and{' '}
          <span className="text-zinc-400">number</span>
        </p>
        <div className="flex justify-center space-x-4">
          <Button
            text={isLoading ? 'Sending...' : 'Create your account'}
            handleClick={(!isLoading && isValid) ? handleClick : () => {}}
            isActive={!isLoading && isValid}
          />
          <Button
            text={'Back'}
            handleClick={() => {
              setPage('intro')
            }}
            isActive={true}
          />
        </div>
        {error.length !== 0 && <p className="text-red-500 pt-4">{error}</p>}
        {isSuccessfully && (
          <p className="text-green-500 text-base pt-4">Sign up successfully</p>
        )}
      </div>
    </div>
  )
}

export default Infor

