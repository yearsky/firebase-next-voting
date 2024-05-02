import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { database } from "../../utils/firebase-config";
import { getDatabase, ref, set, child, onValue } from "firebase/database";
import { v4 as uuidv4 } from "uuid";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessMessage: (value:boolean) => void; 
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose,onSuccessMessage }) => {
  const [text, setText] = useState('');
  const [content, setContent] = useState('');
  const [commentAble, setNotAvailCommentAble] = useState('');
  const [successMessage, setSuccessMessage] = useState(false); 
  const maxCharacters = 200;
  const [disabledBtn, setDisabledBtn] = useState(true);

  useEffect(() => {
    const ableToComment = localStorage.getItem('chanceWriteContent');
    if (ableToComment == 'false') {
      setNotAvailCommentAble('true');
    }

    const dbRef = ref(database, 'content');
    onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const usernames = Object.values(data).map((item: any) => item.username);
      }
    });

  }, []);

  if (!isOpen) return null;

  const handleSaveContent = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const db = database;
      await set(ref(db, 'content/' + uuidv4()), {
        username: localStorage.getItem('username'),
        content: content,
        likes: 0,
      });    
      
      onSuccessMessage(true)
      setContent('')
      setSuccessMessage(true); 
      onClose()
      setTimeout(() => {
        setNotAvailCommentAble('true')
      }, 1500);
      localStorage.setItem('chanceWriteContent', 'false');
    } catch (error) {
      console.error("Error menyimpan username:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setContent(newText)
    if (newText.length <= maxCharacters) {
      setText(newText);
    }

    if(newText.length == 0)
    {
      setDisabledBtn(true)
    }else
    {
      setDisabledBtn(false)
    }
  };

  return (
    <div className="fixed z-50 top-0 left-0 w-full min-h-full flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="bg-white rounded-lg p-6 flex flex-col xl:w-1/2 relative">
        <h2 className={`text-xl text-center font-bold mb-4 mt-5`}>{commentAble == 'true' ? 'Kamu hanya bisa mengajukan 1 pertanyaan saja maaf ya:(' : 'Ajukan Pertanyaan Kamu Disini!'}</h2>
        {commentAble == 'true' ? (<></>) :
          (
            <>
              <div className="relative">
                <input
                  className="border border-gray-400 w-full p-3 xl:p-4 rounded-md"
                  placeholder="Mau Tanya Apa🤔"
                  value={content}
                  onChange={handleChange}
                />
                <span className="absolute right-2 bottom-0 text-gray-500 text-sm">
                  {text.length}/{maxCharacters}
                </span>
              </div>
              <form onSubmit={handleSaveContent} className="flex justify-center">
                <button className={`bg-blue-500 text-white text-center px-4 py-2 rounded-md mt-4 ${disabledBtn == true ? 'disabled cursor-not-allowed bg-red-400 opacity-65' : 'opacity-1 bg-blue-500'}`}>
                  Kirim Pertanyaan
                </button>
              </form>
            </>
          )}

        <button className='absolute right-2 top-2' onClick={onClose}>❌</button>
      </div>
      
    </div>
  );
};

export default Modal;
