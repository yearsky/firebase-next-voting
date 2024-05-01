"use client";
import Image from "next/image";
import { useState, ChangeEvent, FormEvent,useEffect } from "react";
import { database } from "../utils/firebase-config";
import { v4 as uuidv4 } from "uuid";
import { getDatabase, ref, set,get,child,off,onValue } from "firebase/database";
import Modal from "./components/modal";
import Card from "./components/card";

interface User {
  username: string;
}

function ITPLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <Image
      src="/ITP.jpg"
      width={500}
      height={500}
      alt="ITP"
    />
  );
}

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const db = database;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState<any[]>([]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
  
    if (storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
    const fetchData = async () => {
      const dbref = ref(database, 'content');
      
      const onDataChange = (snapshot: any) => {
        if (snapshot.exists()) {
          const firebaseData = snapshot.val();
          const dataArray = Object.keys(firebaseData).map(key => ({ id: key, ...firebaseData[key] }));
          const sortedData = dataArray.slice().sort((a, b) => b.likes - a.likes);
          setData(sortedData);
        }else
        {
          localStorage.setItem('chanceWriteContent', 'false');
        }
      };
  
      onValue(dbref, onDataChange);
  
    };
  
    fetchData();
  }, []);
  

  const handleUsernameSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      set(ref(db, 'users/' + uuidv4()), {
        username: username,
      });
      setIsLoggedIn(true);
      localStorage.setItem('username', username);
    } catch (error) {
      console.error("Error menyimpan username:", error);
    }
  };

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center flex-1 px-4 sm:px-20 text-center">
        <div className="flex justify-center items-center bg-white rounded-full w-16 sm:w-24 h-16 sm:h-24 my-8">
        <ITPLogo className="h-8 sm:h-16 invert p-3 mb-1" />
        </div>
        <h1 className="text-lg sm:text-2xl font-bold mb-2">
          SUNDAY VOTING QnA🎉
        </h1>
        {isLoggedIn ? (
          <>
          <h2 className="text-md sm:text-xl mx-4">
            Silahkan sampaikan pertanyaan atau pendapat kamu!
          </h2>
          
          {data.length == 0 ?  (
          <div className="mt-32">
            <h1 className="text-2xl font-semibold text-nowrap bg-white p-2 rounded-full">Belum Ada Data Pertanyaan 😣</h1>
          </div>) : (
              <div className="grid xl:grid-cols-4 mt-20 gap-2 gap-y-4">
              {data.map(item => (
                <Card key={item.id} id={item.id} username={item.username} content={item.content} likes={item.likes}/>
              ))}
              </div>
          )}
          

          </>
        ) : (
          <div className="mt-4">
            <form onSubmit={handleUsernameSubmit}>
              <input
                aria-label="Suggest a username for our roadmap"
                className="pl-3 py-3 mt-1 text-lg block w-full border border-gray-200 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-300"
                maxLength={150}
                placeholder="Nama Kamu"
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
                Lanjut
              </button>
            </form>
          </div>
        )}
      </main>
      <button className="fixed flex items-center justify-center right-4 bottom-5 px-4 h-10 text-lg border bg-black text-white rounded-md w-32 focus:outline-none focus:ring focus:ring-blue-300 focus:bg-gray-800" onClick={openModal}>
            Pertanyaan
      </button>
      <Modal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}
