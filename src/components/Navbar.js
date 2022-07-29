import React, {useContext} from 'react';
import { Link } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signOut } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore"; 
import { AuthContext} from '../context/auth'
import { useNavigate } from "react-router-dom"

const Navbar = () => {
   const navigate = useNavigate()
   const { user } = useContext(AuthContext)
   const handleSignOut = async () => {
      await updateDoc(doc(db, 'users', auth.currentUser.uid),{
         isOnline: false
      })
      await signOut(auth)
      navigate('/')
   }
   return (
      <nav>
         <h3>
            <Link to="/">Application</Link>
         </h3>

         <div>
            {user ?
            <div>
               <Link to="/profile">Profile</Link>
               <button onClick={handleSignOut} className="btn">LogOut</button>
            </div>
            :
            <div>
               <Link to="/register">Register</Link>
               <Link to="/login">Login</Link>
            </div>}
         </div>
      </nav>
   );
};

export default Navbar;