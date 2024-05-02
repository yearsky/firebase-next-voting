import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { database } from "../../utils/firebase-config";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, getDocs,setDoc } from "firebase/firestore";
import { set } from "firebase/database";
import { ref } from "firebase/storage";

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

    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(database, 'content'));
      querySnapshot.forEach((doc) => {
        const data = doc.data();
      });
    };

    fetchData();

  }, []);

  if (!isOpen) return null;

  const handleSaveContent = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (!disabledBtn) {
        const username = localStorage.getItem('username');
        const db = database;
        await addDoc(collection(database, 'content'), {
          username: username,
          content: content,
          likes: 0,
        });

        onSuccessMessage(true);
        setContent('');
        setSuccessMessage(true);
        onClose();
        setTimeout(() => {
          setNotAvailCommentAble('true');
        }, 1500);
        localStorage.setItem('chanceWriteContent', 'false');
      }
    } catch (error) {
      console.error("Error menyimpan konten:", error);
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
        <h4 className={`text-lg text-slate-500 text-center font-bold mt-5`}>Pertanyaan</h4>
        <h2 className="mb-4 text-xl ">Bahasa Inggrisnya aku cinta kamu apa?</h2>
        <div className="relative">
          <input
            className="border border-gray-400 w-full p-3 xl:p-4 rounded-md"
            placeholder="Isi Jawaban Kamu Disini👍"
            value={content}
            onChange={handleChange}
          />
          <span className="absolute right-2 bottom-0 text-gray-500 text-sm">
            {text.length}/{maxCharacters}
          </span>
        </div>
        <form onSubmit={handleSaveContent} className="flex justify-center">
          <button className={`bg-blue-500 text-white text-center px-4 py-2 rounded-md mt-4 ${disabledBtn == true ? 'disabled cursor-not-allowed bg-red-400 opacity-65' : 'opacity-1 bg-blue-500'}`}>
            Kirim Jawaban
          </button>
        </form>

        <button className='absolute right-2 top-2' onClick={onClose}>❌</button>
      </div>
      
    </div>
  );
};

export default Modal;
