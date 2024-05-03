"use client";
import Image from "next/image";
import { useState, ChangeEvent, FormEvent, useEffect, useRef } from "react";
import { database } from "../utils/firebase-config";
import QnaLayout from "./components/QnaLayout";
import WordCloud from "./components/WordCloud";
import { addDoc, collection } from "firebase/firestore";
import SuccessMessage from "./components/successCard";

interface User {
  username: string;
}

function ITPLogo(props: React.SVGProps<SVGSVGElement>) {
  return <Image src="/ITP.jpg" width={500} height={500} alt="ITP" />;
}

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [successMessage, setSuccessMessage] = useState(false);
  const db = database;

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccessMessage(false);
    }, 5000);
    const storedUsername = localStorage.getItem("username");

    if (storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }

    return () => clearTimeout(timer);
  }, [successMessage]);

  const handleUsernameSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setUsername(username);

      await addDoc(collection(db, "users"), {
        username: username,
      });

      setIsLoggedIn(true);
      localStorage.setItem("username", username);
    } catch (error) {
      console.error("Error menyimpan username:", error);
    }
  };

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleSuccessMessage = () => {
    setSuccessMessage(true);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen">
      <main className="flex flex-col items-center flex-1 px-4 sm:px-20 text-center">
        <div className="flex justify-center items-center bg-white rounded-full w-16 sm:w-24 h-16 sm:h-24 my-8">
          <ITPLogo className="h-8 sm:h-16 invert p-3 mb-1" />
        </div>
        <h1 className="text-lg sm:text-2xl font-bold mb-2">
          ITP SUNDAY - KOMUNIKASI🎉
        </h1>
        {isLoggedIn ? (
          <>
            <SuccessMessage successMessage={successMessage} />
            <WordCloud onSuccess={handleSuccessMessage} />
            {/* <QnaLayout/> */}
          </>
        ) : (
          <div className="mt-4">
            <form onSubmit={handleUsernameSubmit}>
              <input
                aria-label="Suggest a username for our roadmap"
                className="pl-3 py-3 mt-1 text-lg block w-full border border-gray-200 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-300"
                maxLength={150}
                placeholder="Dengan Siapa Disini?"
                required
                type="text"
                name="username"
                value={username}
                onChange={handleUsernameChange}
              />
              <button
                className="bg-blueflex items-center justify-center mt-2 px-4 h-10 text-lg border bg-black text-white rounded-md w-24 focus:outline-none focus:ring focus:ring-blue-300 focus:bg-gray-800"
                type="submit"
              >
                Mulai
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
