import { database } from "@/utils/firebase-config";
import {
  Timestamp,
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import SuccessMessage from "./successCard";

interface Word {
  text: string;
  size: number;
  left: number;
  top: number;
  rotate: number;
  color: string; // Tambahkan properti color
  key: number;
}

interface WordCloudProps {
  onSuccess: () => void;
}

const WordCloud: React.FC<WordCloudProps> = ({ onSuccess }) => {
  const [sentence, setSentence] = useState("");
  const [wordList, setWordList] = useState<Word[]>([]);
  const [isOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const maxWidth = 100; // Ganti dengan lebar maksimum yang diinginkan
  const maxHeight = 100;

  const colors = [
    "#c23531",
    "#2f4554",
    "#61a0a8",
    "#d48265",
    "#91c7ae",
    "#749f83",
    "#ca8622",
    "#bda29a",
    "#6e7074",
    "#546570",
    "#c4ccd3",
  ];

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(database, "wordClouds"), orderBy("createdAt", "desc")),
      (querySnapshot) => {
        const dataArray = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
        }));
        setData(dataArray);
      }
    );

    return unsubscribe;
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSentence(e.target.value);
  };

  const closeModal = () => {
    setModalOpen(true);
  };

  const generateWordCloud = async () => {
    setIsLoading(true);
    const words = sentence.split(" ");
    const wordCloud: Word[] = [];

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const size = Math.floor(Math.random() * 30) + 30;
      let left = Math.min(Math.floor(Math.random() * (maxWidth - size)), 80);
      let top = Math.min(Math.floor(Math.random() * (maxHeight - size)), 80);
      const rotate = Math.floor(Math.random() * 180) - 90;
      const color = colors[Math.floor(Math.random() * colors.length)];

      // Check collision with existing words
      let collides = true;
      while (collides) {
        collides = false;
        for (const existingWord of wordCloud) {
          if (
            Math.abs(existingWord.left - left) < 10 &&
            Math.abs(existingWord.top - top) < 10
          ) {
            collides = true;
            // Move the word to a new random position
            left = Math.min(Math.floor(Math.random() * (maxWidth - 30)), 80);
            top = Math.min(Math.floor(Math.random() * (maxHeight - 30)), 80);
            break;
          }
        }
      }

      wordCloud.push({
        text: word,
        size: size,
        left: left,
        top: top,
        rotate: rotate,
        color: color,
        key: i,
      });
    }

    setWordList(wordCloud);

    const addDocumentsPromise = addDocumentsAsync(wordCloud);
    addDocumentsPromise
      .then(() => {
        onSuccess();
      })
      .finally(() => {
        closeModal();
        setIsLoading(false);
      });
    await addDocumentsPromise;
  };

  async function addDocumentsAsync(word: any) {
    const currentDate = new Date();
    const timestamp = Timestamp.fromDate(currentDate);
    const username = localStorage.getItem("username");

    const promise = addDoc(collection(database, "wordClouds"), {
      username: username,
      word: word,
      createdAt: timestamp,
    });

    return promise;
  }

  return (
    <div className="flex flex-col justify-center items-center gap-y-6 w-full">
      <div className="bg-white w-[50vh] md:w-[150vh] h-[50vh] rounded-md relative overflow-hidden">
        {data.map((item, index) => (
          <div key={index}>
            {item.word.map((value: any, wordIndex: any) => (
              <span
                key={wordIndex}
                className="absolute"
                style={{
                  overflow: "hidden",
                  fontSize: `${value.size}px`,
                  left: `${value.left}%`,
                  top: `${value.top}%`,
                  transform: `rotate(${value.rotate}deg)`,
                  color: value.color,
                }}
              >
                {value.text}
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className="bg-black w-3/4 rounded-md mt-4 p-4 md:hidden">
        <input
          placeholder="Enter your sentence..."
          value={sentence}
          onChange={handleInputChange}
          className="w-full px-4 py-2 mb-2 bg-white rounded-md"
        />
        <button
          onClick={generateWordCloud}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Generate Word Cloud
        </button>
      </div>
      <div
        className={`hidden fixed z-50 top-0 left-0 w-full min-h-full ${
          !isOpen ? "md:flex" : ""
        } items-center justify-center bg-gray-500 bg-opacity-50`}
      >
        <div className="bg-white rounded-lg p-6 xl:w-1/2 relative">
          <h4 className={`text-lg text-slate-500 text-center font-bold mt-5`}>
            Pertanyaan
          </h4>
          <h2 className="mb-4 text-xl ">
            Bahasa Inggrisnya aku cinta kamu apa?
          </h2>
          <input
            placeholder="Enter your sentence..."
            value={sentence}
            onChange={handleInputChange}
            className="border mb-4 border-gray-400 w-full p-3 xl:p-4 rounded-md"
          />
          <button
            onClick={generateWordCloud}
            disabled={isLoading}
            className="px-5 py-2 mt-2 rounded bg-indigo-500 text-white 
             disabled:bg-gray-500/80 disabled:cursor-not-allowed"
          >
            {isLoading && (
              <i className="animate-spin fa-solid fa-circle-notch mr-2"></i>
            )}
            {isLoading ? "Loading..." : "Kirim Jawaban"}
          </button>

          {/* <button className="absolute right-2 top-2" onClick={closeModal}>
            ❌
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default WordCloud;
