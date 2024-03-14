import { useState, useEffect } from "react";
import { m, domAnimation, LazyMotion, AnimatePresence } from "framer-motion";

const Splash = () => {
  // States
  const [key, setKey] = useState(0);
  // Effects
  useEffect(() => {
    const timer = setTimeout(() => {
      setKey((key) => key + 1);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <LazyMotion features={ domAnimation }>
      <AnimatePresence initial mode={ "wait" }>
        <m.img 
          key={ key }
          src={ "/assets/images/Logo_Blue.svg" } 
          alt={ "ロゴ" } 
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
          className={ "w-[30%] select-none" } 
        />
      </AnimatePresence>
    </LazyMotion>
  );
};
export default Splash;