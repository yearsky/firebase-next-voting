/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import Image from "next/image";
import { useState, ChangeEvent, FormEvent, useEffect, useRef } from "react";
import { database } from "../utils/firebase-config";
import store, {
  AppDispatch,
  RootState,
  useAppDispatch,
  useAppSelector,
} from "./redux/store";
import {
  selectUsername,
  setIsLoggedInHooks,
  selectIsLoggedIn,
  setUsername,
} from "./redux/userSlice";
import QnaLayout from "./components/QnaLayout";
import WordCloud from "./components/WordCloud";
import { addDoc, collection, onSnapshot, query } from "firebase/firestore";
import SuccessMessage from "./components/successCard";
import {
  clearAnswer,
  clearChanceAnswer,
  setChanceAnswer,
  setIsAnswered,
} from "./redux/wordSlice";
import Polls from "./components/Polls";
import { error } from "console";

function ITPLogo(props: React.SVGProps<SVGSVGElement>) {
  return <Image src="/ITP.jpg" width={500} height={500} alt="ITP" />;
}

export default function Home() {
  const dispatch = useAppDispatch();
  const [questions, setQuestions] = useState<
    { text: string; section: string }[]
  >([]);
  const storedUsername = useAppSelector(selectUsername);
  const isLogginDevice = useAppSelector(selectIsLoggedIn);
  const [isLoggedInThis, setIsLoggedIn] = useState(false);
  const [isDataUpdated, setIsDataUpdated] = useState(false);
  const [usernameState, setUsernameState] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const db = database;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDataUpdated(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [isDataUpdated]); //

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccessMessage(false);
    }, 5000);

    if (storedUsername) {
      setIsLoggedIn(true);
      setUsernameState(storedUsername);

      try {
        const unsubscribe = onSnapshot(
          query(collection(database, "activeSections")),
          { includeMetadataChanges: true },
          (querySnapshot) => {
            const dataArray = querySnapshot.docs.map((doc) => ({
              ...doc.data(),
            }));
            setData(dataArray);
            setIsDataUpdated(true);
          },

          (error) => {
            console.log("ada error nich:" + error);
          }
        );

        return unsubscribe;
      } catch (error) {
        console.log("erorrw" + error);
      }
    }

    return () => clearTimeout(timer);
  }, [storedUsername, isLogginDevice]);

  const handleUsernameSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setUsernameState(usernameState);

      await addDoc(collection(db, "users"), {
        username: usernameState,
      });

      dispatch(setUsername(usernameState));
      dispatch(setIsLoggedInHooks(true));
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Error menyimpan username:", error);
    }
  };

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsernameState(event.target.value);
  };

  const handleSuccessMessage = () => {
    setSuccessMessage(true);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-orange-500">
      <main className="flex flex-col items-center flex-1 px-4 sm:px-20 text-center">
        <div className="flex justify-center items-center bg-white rounded-full w-16 sm:w-24 h-16 sm:h-24 my-8">
          <ITPLogo className="h-8 sm:h-16 invert p-3 mb-1" />
        </div>
        <h1 className="text-lg sm:text-2xl font-bold mb-2 text-white">
          13th Sunday ITP - Basic Communication
        </h1>
        {isLogginDevice ? (
          <>
            <SuccessMessage successMessage={successMessage} />
            {data.length > 0 ? (
              <>
                {isDataUpdated ? (
                  <div className="flex justify-center items-center h-[50vh]">
                    <h2 className="text-center font-bold animate-bounce text-white">
                      Tunggu Sebentar ya!😁
                    </h2>
                  </div>
                ) : (
                  <>
                    {data.map((item) => {
                      return item.active && item.section === "wordClouds" ? (
                        <WordCloud onSuccess={handleSuccessMessage} />
                      ) : item.active && item.section === "Polls" ? (
                        <Polls />
                      ) : (
                        <QnaLayout />
                      );
                    })}
                  </>
                )}
              </>
            ) : (
              ""
            )}
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
                value={usernameState}
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
