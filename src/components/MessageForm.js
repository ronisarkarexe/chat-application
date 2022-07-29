import React from 'react';
import Upload from './svg/Upload';

const MessageForm = ({handleSubmitButton, text, setText, setImg}) => {
   return (
      <form className="messageForm" onSubmit={handleSubmitButton}>
         <label htmlFor="img"><Upload/></label>
         <input type="file" name="" id="img" accept='image/*' style={{display: "none"}} onChange={(e) => setImg(e.target.files[0])}/>
         <div>
            <input  type="text" name="" placeholder='Enter message' value={text} onChange={(e) => setText(e.target.value)}/>
         </div>
         <div>
            <button type="submit" className="btn">Send</button>
         </div>
      </form>
   );
};

export default MessageForm;