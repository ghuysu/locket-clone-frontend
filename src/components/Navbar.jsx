import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const Navbar = ({ user, setPage, signoutHandler, setSearchKey}) => {
  const logoRef = useRef(null);
  const nameRef = useRef(null);
  const searchRef = useRef(null);
  const userRef = useRef(null);
  const searchBtnRef = useRef(null);
  const logoBtnRef = useRef(null);

  const [showPopup, setShowPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [input, setInput] = useState('')

  useEffect(() => {
    const logo = logoRef.current;
    const name = nameRef.current;
    const search = searchRef.current;
    const userDiv = userRef.current;

    gsap.fromTo(logo, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.5 });
    gsap.fromTo(name, { opacity: 0 }, { opacity: 1, duration: 0.5, delay: 0.5 });
    gsap.fromTo(userDiv, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.5, delay: 1 });
    gsap.fromTo(search, { opacity: 0, x: -200 }, { opacity: 1, x: 0, duration: 0.5, delay: 1.5 });
  }, []);

  useEffect(() => {
    const searchBtn = searchBtnRef.current;
    const logoBtn = logoBtnRef.current;

    const handleMouseEnter = (object) => {
      gsap.to(object, { scale: 0.9, duration: 0.2 });
    };
    const handleMouseLeave = (object) => {
      gsap.to(object, { scale: 1, duration: 0.2 });
    };

    searchBtn.addEventListener('mouseenter', () => handleMouseEnter(searchBtn));
    searchBtn.addEventListener('mouseleave', () => handleMouseLeave(searchBtn));
    logoBtn.addEventListener('mouseenter', () => handleMouseEnter(logoBtn));
    logoBtn.addEventListener('mouseleave', () => handleMouseLeave(logoBtn));

    return () => {
      searchBtn.removeEventListener('mouseenter', () => handleMouseEnter(searchBtn));
      searchBtn.removeEventListener('mouseleave', () => handleMouseLeave(searchBtn));
      logoBtn.removeEventListener('mouseenter', () => handleMouseEnter(logoBtn));
      logoBtn.removeEventListener('mouseleave', () => handleMouseLeave(logoBtn));
    };
  }, []);

  const searchButtonHandler = () => {
    setSearchKey(input)
    setInput('')
  }

  const inputChangeHandler = (event) => {
    setInput(event.target.value)
  }

  return (
    <div className='fixed top-0 left-0 w-full bg-black flex items-center justify-between shadow-[0_10px_14px_rgba(40,40,40,0.2)] z-50'>
      <div onClick={() => setPage('main')} ref={logoBtnRef} className="ml-5 flex justify-center items-center cursor-pointer">
        <img ref={logoRef} className="w-8" src="/public/assets/images/logo.png" alt="Logo" />
        <p ref={nameRef} className="text-white font-bold text-2xl pl-4">Locket</p>
      </div>
      <div ref={searchRef} className='flex items-center relative z-50'>
        <input
          type='text'
          className='bg-[#19191a] text-sm medium text-gray placeholder-zinc-600 sm: md:w-[400px] lg:w-[600px] px-3 py-2 rounded-2xl focus:outline-none'
          placeholder='Search friends ...'
          onChange={inputChangeHandler}
          value={input}
        />
        <div ref={searchBtnRef} onClick={searchButtonHandler} className='cursor-pointer ml-2 absolute rounded-full px-6 py-2 bg-yellow-500 right-0'>
          <img className="w-5" src="/public/assets/images/search-icon.png" alt="Search Icon" />
        </div>
      </div>
      <div
        className='pb-4 relative'
        style={{ transform: 'translateY(8px)' }} 
        onMouseEnter={() => setShowPopup(true)}
        onMouseLeave={() => {
          setShowPopup(false);
          setShowEditPopup(false);
        }}>
        <div 
            ref={userRef} 
            className=' max-w-[150px] relative flex items-center mr-5 bg-[#151516] px-3 py-1 rounded-full cursor-pointer z-50'
        >
            <p className='text-sm text-gray-400 font-medium mr-2'>{`${user.fullname.firstname} ${user.fullname.lastname}`}</p>
            <img className='w-9 h-9 rounded-full border-2 border-yellow-400' src={user.profileImageUrl} alt="Profile" />
            {showPopup && (
            <div className='absolute top-14 right-0 w-36 bg-[#19191a] shadow-[0_2px_4px_rgba(60,60,60,0.2)] rounded-lg z-50'>
              <ul className='text-gray text-left medium text-sm z-50'>
                <li className='px-4 py-3 cursor-pointer hover:text-yellow-500 border-b border-zinc-800' onClick={() => {setPage('profile'); setShowPopup(false)}}>View your profile</li>
                <li 
                  className='px-4 py-3 cursor-pointer hover:text-yellow-500 border-b border-zinc-800 relative'
                  onMouseEnter={() => setShowEditPopup(true)}
                  onMouseLeave={() => setShowEditPopup(false)}
                >
                  Edit information
                  {showEditPopup && (
                    <div className='absolute top-0 right-[140px] pr-2 z-50'>
                      <ul className='text-gray text-left medium text-sm ml-2 w-28 bg-[#19191a] shadow-[0_1px_2px_rgba(60,60,60,0.2)] rounded-lg z-50'>
                        <li className='px-2 py-2 cursor-pointer hover:text-yellow-500 border-b border-zinc-800' onClick={() => {setPage('edit-avatar'); setShowEditPopup(false); setShowPopup(false)}}>Edit avatar</li>
                        <li className='px-2 py-2 cursor-pointer hover:text-yellow-500 border-b border-zinc-800' onClick={() => {setPage('edit-fullname'); setShowEditPopup(false); setShowPopup(false)}}>Edit fullname</li>
                        <li className='px-2 py-2 cursor-pointer hover:text-yellow-500 border-b border-zinc-800' onClick={() => {setPage('edit-birthday'); setShowEditPopup(false); setShowPopup(false)}}>Edit birthday</li>
                        <li className='px-2 py-2 cursor-pointer hover:text-yellow-500' onClick={() => {setPage('edit-email'); setShowEditPopup(false); setShowPopup(false)}}>Edit email</li>
                      </ul>
                    </div>
                  )}
                </li>
                <li className='px-4 py-3 cursor-pointer hover:text-yellow-500 border-b border-zinc-800' onClick={() => {setPage('friends'); setShowPopup(false)}}>Friends</li>
                <li className='px-4 py-3 cursor-pointer hover:text-yellow-500 border-b border-zinc-800' onClick={() => {signoutHandler(); setShowPopup(false)}}>Sign out</li>
                <li className='px-4 py-3 cursor-pointer hover:text-red-500 z-50' onClick={() => {setPage('delete'); setShowPopup(false)}}>Delete account</li>
              </ul>
            </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
