import { useRef, useEffect } from 'react';
import gsap from 'gsap';

const Logo = () => {
    const logoRef = useRef(null);
    const titleRef = useRef(null);
    useEffect(() => {
        const logo = logoRef.current;
        const title = titleRef.current;

        gsap.fromTo(logo, { opacity: 0 }, { opacity: 1, duration: 0.5 });
        gsap.fromTo(title, { opacity: 0 }, { opacity: 1, duration: 0.5, delay: 0.5 });
    }, []);
    return (
        <div className="w-fdiv flex justify-center items-center">
            <img ref={logoRef} className="w-[50px]" src="/public/assets/images/logo.png" alt="Logo" />
            <p ref={titleRef} className="text-white bold text-5xl pl-4">Locket</p>
        </div>
    )
}

export default Logo
