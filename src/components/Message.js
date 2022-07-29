import React, { useRef, useEffect } from 'react';
import Moment from 'react-moment';


const Message = ({msg, user1}) => {
   const scrollRef = useRef();

   useEffect(()=>{
      scrollRef.current?.scrollIntoView({behavior: 'smooth'})
   },[msg])
   return (
      <div className={`messageWrapper ${msg.from === user1 ? 'own' : ""}`} ref={scrollRef}>
         <p className={`${msg.from === user1 ? 'me' : "friend"}`}>
            {msg.image ? <img src={msg.image} alt={msg.text}/> : null}
            {msg.text}
            <br />
            <small>
               {/* <Moment fromNow>{msg.createdAt.toDate()}</Moment> */}
               <Moment fromNow>{msg.createAt.toDate().getTime()}</Moment>
            </small>
         </p>
      </div>
   );
};

export default Message;