import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { database } from "../../utils/firebase-config";
import { v4 as uuidv4 } from "uuid";
import {
  addDoc,
  collection,
  getDocs,
  setDoc,
  where,
  query,
} from "firebase/firestore";
import { ref } from "firebase/storage";
import { useAppDispatch, useAppSelector } from "../redux/store";
import {
  chanceAnswer,
  currentSectionChange,
  selectAnswer,
  setIsAnswered,
} from "../redux/wordSlice";
import { dispatch } from "d3";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: string;
  onSubmit: (content: string) => void;
  onRadioChange?: (value: string) => void;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  section,
  onSubmit,
  onRadioChange,
}) => {
  const [text, setText] = useState("");
  const [content, setContent] = useState("");
  const dispatch = useAppDispatch();
  const isAnswered = useAppSelector(selectAnswer);
  const chanceAnswerQuestion = useAppSelector(chanceAnswer);
  const currentSection = useAppSelector(currentSectionChange);
  const [questions, setQuestions] = useState("");
  const [radioValue, setRadioValue] = useState("");
  const maxCharacters =
    section == "wordClouds" ? 20 : section == "QnA" ? 200 : 200;
  const [disabledBtn, setDisabledBtn] = useState(true);

  useEffect(() => {
    // disabledButtonChange();

    const radios = document.querySelectorAll<HTMLInputElement>(
      'input[type="radio"]'
    );
    if (isAnswered && section === "Polls" && chanceAnswerQuestion === 0) {
      radios.forEach((radio) => {
        radio.disabled = true;
      });
    } else {
      radios.forEach((radio) => {
        radio.disabled = false;
      });
    }

    const fetchDataQuestions = async () => {
      const q = query(
        collection(database, "questions"),
        where("section", "==", section)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setQuestions(doc.data().text);
      });
    };

    fetchDataQuestions();
  }, [content]);

  if (!isOpen) return null;

  const disabledButtonChange = () => {
    if (chanceAnswerQuestion !== 1) {
      setDisabledBtn(true);

      if (content.length === 0) {
        setDisabledBtn(true);
      } else {
        setDisabledBtn(false);
      }
    } else {
      setDisabledBtn(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setContent(newText);
    if (newText.length <= maxCharacters) {
      setText(newText);
    }

    if (newText.length == 0) {
      setDisabledBtn(true);
    } else {
      setDisabledBtn(false);
    }
  };

  const handleSaveContent = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(content);
    setContent("");
    setText("");
  };

  const handleRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRadioValue(value);
    if (onRadioChange) {
      onRadioChange(value);
    }
  };
  return (
    <div className="fixed z-50 top-0 left-0 w-full min-h-full flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="bg-white rounded-lg p-6 flex flex-col xl:w-1/2 relative">
        <div className="flex justify-center gap-2">
          <span
            className={`${
              section == "wordClouds" ? "bg-blue-400" : "bg-blue-400"
            } w-14 h-5 p-2 rounded-full`}
          ></span>
          <span
            className={`${
              section == "qna" || section == "Polls"
                ? "bg-blue-400"
                : "bg-gray-400"
            } w-14 h-5 p-2 rounded-full`}
          ></span>
          <span
            className={`${
              section == "qna" ? "bg-blue-400" : "bg-gray-400"
            } w-14 h-5 p-2 rounded-full`}
          ></span>
        </div>
        <h4 className={`text-lg text-slate-500 text-center font-bold mt-5`}>
          Pertanyaan Ke-
          {section == "wordClouds" ? "1" : section == "Polls" ? "2" : "3"}
        </h4>
        <h2 className="mb-4 text-xl ">{questions}</h2>
        {section == "Polls" ? (
          <>
            <div className="flex flex-col my-2">
              <div className="flex items-center gap-x-2 p-2 border-2 rounded-lg my-2">
                <input
                  type="radio"
                  name="chatType"
                  disabled={isAnswered}
                  value="Keluarga"
                  onChange={handleRadioChange}
                />
                <label>Keluarga</label>
              </div>
              <div className="flex items-center gap-x-2 p-2 border-2 rounded-lg my-2">
                <input
                  type="radio"
                  name="chatType"
                  disabled={isAnswered}
                  value="Pertemanan"
                  onChange={handleRadioChange}
                />
                <label>Pertemanan</label>
              </div>
              <div className="flex items-center gap-x-2 p-2 border-2 rounded-lg my-2">
                <input
                  type="radio"
                  name="chatType"
                  disabled={isAnswered}
                  value="Pekerjaan"
                  onChange={handleRadioChange}
                />
                <label>Pekerjaan</label>
              </div>
            </div>
          </>
        ) : (
          <div className="relative">
            <input
              className="border border-gray-400 w-full p-3 xl:p-4 rounded-md"
              placeholder="Isi Jawaban Kamu Disini👍"
              value={content}
              onChange={handleChange}
              disabled={section == currentSection && isAnswered ? true : false}
            />
            <span className="absolute right-2 bottom-0 text-gray-500 text-sm">
              {text.length}/{maxCharacters}
            </span>
          </div>
        )}
        <form onSubmit={handleSaveContent} className="flex justify-center">
          {section === "Polls" && (
            <button
              className={`bg-blue-500 text-white text-center px-4 py-2 rounded-md mt-4 
            ${
              radioValue == "" || (section == currentSection && isAnswered)
                ? "disabled cursor-not-allowed bg-red-400 opacity-65"
                : "opacity-1 bg-blue-500"
            }`}
            >
              {section == currentSection && isAnswered
                ? "Jawaban Kamu Sudah Terkirim!🎉"
                : "Kirim Jawaban"}
            </button>
          )}
          {section !== "Polls" && (
            <button
              className={`bg-blue-500 text-white text-center px-4 py-2 rounded-md mt-4 
            ${
              section == currentSection && isAnswered
                ? "disabled cursor-not-allowed bg-red-400 opacity-65"
                : "opacity-1 bg-blue-500"
            }`}
            >
              {section == currentSection && isAnswered
                ? "Jawaban Kamu Berhasil Di Kirim!🎉"
                : "Kirim Jawaban"}
            </button>
          )}
        </form>
        {section == "qna" ? (
          <button className="absolute right-2 top-2" onClick={onClose}>
            ❌
          </button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Modal;
