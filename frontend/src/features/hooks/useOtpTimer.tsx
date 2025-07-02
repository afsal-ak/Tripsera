import React,{useEffect,useState} from 'react'


const OTP_EXPIRY_MINUTES = 5;
const OTP_TIMER_KEY = "otp_expiry_timestamp";


export const useOtpTimer  = () => {
    const [timeLeft,setTimeLeft]=useState(0)

    const formatTime=(seconds:number)=>{
        const mins=Math.floor(seconds/60)
        .toString()
        .padStart(2,"0")

        const secs=(seconds%60).toString().padStart(2,"0")
        return `${mins}:${secs}`
    }

    const startTimer=()=>{
        const expiryTime=Date.now()+OTP_EXPIRY_MINUTES*60*1000;
        localStorage.setItem(OTP_TIMER_KEY,expiryTime.toString())
        updateTimeLeft()
    }

    const updateTimeLeft=()=>{
        const expiry=parseInt(localStorage.getItem(OTP_TIMER_KEY)||"0",10)
        const now=Date.now()
        const diff=Math.floor((expiry-now)/1000)
        setTimeLeft(diff>0?diff:0);
    }

    // useEffect(()=>{
    //     updateTimeLeft()

    //     const interval=setInterval(()=>{
    //         updateTimeLeft()
    //     },1000)

    //     return ()=>{
    //         clearInterval(interval)
    //     }
    // },[])
useEffect(() => {
  const expiry = localStorage.getItem(OTP_TIMER_KEY);

  if (!expiry) {
     startTimer();
  } else {
    updateTimeLeft();
  }

  const interval = setInterval(() => {
    updateTimeLeft();
  }, 1000);

  return () => {
    clearInterval(interval);
  };
}, []);

  return{
    timeLeft,
    formattedTime:formatTime(timeLeft),
    isExpired:timeLeft<=0,
    startTimer
  } 
   
  
}

