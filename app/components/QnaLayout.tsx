import { useEffect, useRef, useState } from "react";
import Modal from "./modal";
import Card from "./card";
import { database } from "../../utils/firebase-config";
import { collection, getDocs, onSnapshot, orderBy, query } from "firebase/firestore";

export default function QnaLayout()
{
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);
    const successMessageRef = useRef<HTMLDivElement>(null);
    const [data, setData] = useState<any[]>([]);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
    setIsModalOpen(false);
    };

    const handleSuccessMessage = (value: boolean) => {
    setSuccessMessage(value);
        if (value) {
            setTimeout(() => {
            setSuccessMessage(false);
            }, 5000);
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => setSuccessMessage(false), 5000);
        clearInterval(timer)

        const unsubscribe = onSnapshot(query(collection(database, "content"), orderBy("likes", "desc")), (querySnapshot) => {
          const dataArray = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setData(dataArray);
        });
    
        return unsubscribe;
    },[])
    
    return (
        <>
            <h2 className="text-md sm:text-xl mx-4">
                Yukk, Jawab pertanyaan yang sudah diberikan! Ada Voucher senilai jutaan menanti kamu😎
            </h2>

            <button
              className={`fixed z-50 flex items-center justify-center right-4 bottom-5 px-4 h-10 text-lg border bg-black text-white rounded-md w-32 focus:outline-none focus:ring focus:ring-blue-300 focus:bg-gray-800`}
              onClick={openModal}
            >
              Pertanyaan
            </button>
            <Modal
              isOpen={isModalOpen}
              onClose={closeModal}
              onSuccessMessage={handleSuccessMessage}
            />
            <div
              ref={successMessageRef}
              className={`fixed top-5 z-50 right-3 p-2 rounded-md bg-green-400 text-white ${
                successMessage ? "slide-in" : "slide-out"
              }`}
            >
              <h4>Horray!🎉 Jawaban Kamu Terkirim😉</h4>
            </div>

            {data.length == 0 ? (
              <div className="mt-32">
                <h1 className="text-2xl font-semibold text-nowrap bg-white p-2 rounded-full">
                  Belum Ada Data Pertanyaan 😣
                </h1>
              </div>
            ) : (
              <div className="grid xl:grid-cols-4 w-full mt-20 gap-2 gap-y-4">
                {data.map((item) => (
                  <Card
                    key={item.id}
                    id={item.id}
                    username={item.username}
                    content={item.content}
                    likes={item.likes}
                  />
                ))}
              </div>
            )}
        </>
    )
}