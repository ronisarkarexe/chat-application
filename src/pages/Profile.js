import React, { useState, useEffect } from 'react';
import Camera from '../components/svg/Camera';
import Delete from '../components/svg/Delete'
import image from '../img/roni.jpg';
import { storage, db, auth } from '../firebase';
import { ref, getDownloadURL, uploadBytes, deleteObject } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom'

const Profile = () => {
   const [img, setImg] = useState('')
   const [user, setUser] = useState()
   //console.log(img.name)
   const navigate = useNavigate()

   useEffect(() =>{
      getDoc(doc(db, 'users', auth.currentUser.uid)).then((docSnap) => {
         if (docSnap.exists()) {
            setUser(docSnap.data());
         }
         else {
            console.log("No such document!");
         }
      })
      if(img){
         const uploadImg = async () => {
            const imgRef = ref(storage, `avatar/${new Date().getTime()} - ${img.name}`);

            try{
               if(user.avatarPath){
                  await deleteObject(ref(storage, user.avatarPath))
               }
               const result = await uploadBytes(imgRef, img);
               const url = await getDownloadURL(ref(storage, result.metadata.fullPath))
   
               await updateDoc(doc(db, 'users', auth.currentUser.uid),{
                  avatar: url,
                  avatarPath: result.metadata.fullPath,
               })
               setImg('')
            }
            catch(err){
               console.log(err.message)
            }
            // console.log('res',result.metadata.fullPath)
            // console.log('url',url)
         }
         uploadImg()
      }
   },[img])

   const handleDelete = async () => {
      try{
         const confirm = window.confirm('Are you sure you want to delete this image?')
         if(confirm){
            await deleteObject(ref(storage, user.avatarPath))

            await updateDoc(doc(db, 'users', auth.currentUser.uid),{
               avatar: '',
               avatarPath: '',
            })
            navigate('/')
         }
      }
      catch(err){
         console.log(err.message)
      }
   }

   return user ? (
      <section>
         <div className="profile_container">
            <div className="img_container">
               <img src={user.avatar? user.avatar : image} alt="avatar" />
               <div className="overlay">
                  <label htmlFor="photo">
                     <Camera/>
                     {user.avatar ? <Delete handleDelete={handleDelete}/> : null}
                  </label>
                  <input type="file" accept='image/*' style={{display: 'none'}} id="photo" onChange={e => setImg(e.target.files[0])}/>
               </div>
            </div>
            <div className="text_container">
               <h3>{user.name}</h3>
               <p>{user.email}</p>
               <hr />
               <small>Joined on: {user.createAt.toDate().toDateString()}</small>
            </div>
         </div>
      </section>
   ): null;
};

export default Profile;