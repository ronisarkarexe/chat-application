import React, { useState, useEffect } from 'react';
import image from '../img/img_avatar.png';
import { db } from '../firebase';
import { onSnapshot, doc } from "firebase/firestore";


const User = ({user, selectUsers, user1, chat}) => {
   const user2 = user?.uid;
   const [data, setData] = useState('');

   useEffect(()=> {
      const id = user1 > user2 ? `${user1+user2}` : `${user2+user1}`;
      let unSub = onSnapshot(doc(db, 'lastMag', id), (doc) => {
         setData(doc.data());
      })
      return () => unSub()
   },[user1, user2])

   return (
      <>
      <div onClick={() => selectUsers(user)} className={`userWrapper ${chat.name === user.name && 'selected_user'}`}>
         <div className="userInfo">
            <div className="userDetail">
               <img src={user.avatar ? user.avatar : image} alt="img" className="avatar"/>
               <h4>{user.name}</h4>
               {data?.from !== user1 && data?.unread && <span className="unread">New</span>}
            </div>
            <div className={`userStatus ${user.isOnline ? 'online' : 'offline'}`}></div>
         </div>
         {
            data && (<p className="truncate">
               <strong>{data.from === user1 ? "Me" : null}</strong>
               {data.text}
            </p>)
         }
      </div>
      <div onClick={() => selectUsers(user)} className={`smContainer ${chat.name === user.name && 'selected_user'}`}>
         <img src={user.avatar ? user.avatar : image} alt="img" className="avatar smScreen"/>
      </div>
      </>
   );
};

export default User;