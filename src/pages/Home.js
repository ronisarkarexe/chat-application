import React, { useState } from 'react';
import { useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, Timestamp, orderBy, setDoc, doc, getDoc, updateDoc } from "firebase/firestore";

import { db, auth, storage } from '../firebase';
import User from '../components/User';
import MessageForm from '../components/MessageForm';
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import Message from '../components/Message';

const Home = () => {
   const [users, setUsers] = useState([])
   const [chat, setChat] = useState("")
   const [text, setText] = useState("")
   const [img, setImg] = useState("")
   const [msgs, setMsgs] = useState([])

   const user1 = auth.currentUser.uid

   useEffect(()=>{
      const userRef = collection(db, 'users')

      // create query object
      const q = query(userRef, where('uid', 'not-in', [auth.currentUser.uid]))

      // execute query
      const unSub = onSnapshot(q, querySnapshot => {
         let users = []
         querySnapshot.forEach(doc => {
            users.push(doc.data())
         })
         setUsers(users)
      })
      return () => unSub()
   },[])

   //console.log(users)

   const selectUsers = async (user) => {
      setChat(user)
      //console.log('user', user)
      
      const user2 = user.uid;
      const id = user1 > user2 ? `${user1+user2}` : `${user2+user1}`;

      const msgsRef = collection(db, 'messages', id, 'chat')
      const q = query(msgsRef, orderBy('createAt', 'asc'));
      onSnapshot(q, (querySnapshot) => {
         let msg = [];
         querySnapshot.forEach((doc) => {
            msg.push(doc.data())
         });
         setMsgs(msg);
      });

      // get last message between logged in user and selected user
      const docSnap = await getDoc(doc(db, 'lastMag', id))
      //if last message exists and message is from selected user
      if(docSnap.data() && docSnap.data().from !== user1){
         //update last message doc set unread to false
         await updateDoc(doc(db, 'lastMag', id),{unread: false})
      }
   }

   const handleSubmitButton = async (e) => {
      e.preventDefault()

      const user2 = chat.uid;
      const id = user1 > user2 ? `${user1+user2}` : `${user2+user1}`;

      let url;
      if(img){
         const imgRef = ref(storage, `images/${new Date().getTime()} - ${img.name}`);

         const result = await uploadBytes(imgRef, img);
         url = await getDownloadURL(ref(storage, result.metadata.fullPath))
      }

      //console.log('Url',url)


      await addDoc(collection(db, 'messages', id, 'chat'), {
         text,
         from: user1,
         to: user2,
         createAt: Timestamp.fromDate(new Date()),
         image: url ? url : "",
      })

      await setDoc(doc(db, 'lastMag', id),{
         text,
         from: user1,
         to: user2,
         createAt: Timestamp.fromDate(new Date()),
         image: url ? url : "",
         unread: true,
      })
      setText('')
   }

   return (
      <div className="homeContainer">
         <div className="userContainer">
            {
               users.map(user => <User key={user.uid} user={user} selectUsers={selectUsers} user1={user1} chat={chat}></User>)
            }
         </div>
         <div className="messageContainer">
            {chat ? 
            <>
               <div className="messageUser">
                  <h3>{chat.name}</h3>
               </div>
               <div className="messages">
                  {msgs.length ? msgs.map((msg, i) => <Message key={i} msg={msg} user1={user1}/>) : null}
               </div>
               <MessageForm handleSubmitButton={handleSubmitButton} text={text} setText={setText} setImg={setImg}/>
            </>
            : <h3 className="noCon">Select a user to start conversation.</h3>}
         </div>
      </div>
   );
};

export default Home;