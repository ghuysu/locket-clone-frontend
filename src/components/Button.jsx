import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Button({ isActive, handleClick, text }) {
    const buttonRef = useRef(null)

    useEffect(() => {
        const button = buttonRef.current

        const handleMouseEnter = () => {
            gsap.to(button, { scale: 0.9, duration: 0.2 })
        }
        const handleMouseLeave = () => {
            gsap.to(button, { scale: 1, duration: 0.2 })
        }

        button.addEventListener('mouseenter', handleMouseEnter)
        button.addEventListener('mouseleave', handleMouseLeave)

        return () => {
            button.removeEventListener('mouseenter', handleMouseEnter)
            button.removeEventListener('mouseleave', handleMouseLeave)
        }
    }, [])
    
    return (
        <div ref={buttonRef}>
            <button 
                className={`btn bold ${isActive ? 'isActive' : ''}`} 
                onClick={handleClick}
            >
                {text}
            </button>
        </div>
    );
}
