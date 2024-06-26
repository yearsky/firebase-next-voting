import { useEffect, useRef, useState } from "react";
import Modal from "./modal";
import Card from "./card";
import { database } from "../../utils/firebase-config";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { selectUsername } from "../redux/userSlice";
import {
  clearAnswer,
  clearChanceAnswer,
  setChanceAnswer,
  setIsAnswered,
  setSectionProps,
} from "../redux/wordSlice";

export default function QnaLayout() {
  clearAnswer();
  clearChanceAnswer();
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [successMessage, setSuccessMessage] = useState(false);
  const currentUsername = useAppSelector(selectUsername);
  const successMessageRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<any[]>([]);
  const [isStop, setIsStop] = useState(false);

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
  };

  useEffect(() => {
    try {
      const triggerStop = onSnapshot(
        query(collection(database, "triggerStopQna")),
        { includeMetadataChanges: true },
        (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.stop) {
              setIsStop(true);
            } else {
              setIsStop(false);
            }
          });
        }
      );
      const unsubscribe = onSnapshot(
        query(
          collection(database, "content"),
          orderBy("likes", "desc"),
          limit(250)
        ),
        { includeMetadataChanges: true },
        (querySnapshot) => {
          const dataArray = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setData(dataArray);
        }
      );

      return () => {
        unsubscribe();
        triggerStop();
      };
    } catch (error) {
      console.log("adaeerror:" + error);
    }
  }, []);

  const handleSubmit = async (content: string) => {
    if (!isStop) {
      await addDocumentsAsync(currentUsername, content);
      dispatch(setIsAnswered(true));
      dispatch(setSectionProps("qna"));
      dispatch(setChanceAnswer(0));
      dispatch(clearChanceAnswer());
      closeModal();
    } else {
      console.log("Adding question is stopped");
    }
  };

  async function addDocumentsAsync(username: any, content: any) {
    // const makePromise = [];

    // for (let i = 0; i < 20; i++) {
    //   makePromise.push(promise);
    // }
    const promise = await addDoc(collection(database, "content"), {
      likes: 0,
      username: username,
      content: content,
    });

    return promise;
  }

  return (
    <>
      <h2 className="text-md sm:text-xl mx-4 font-semibold">
        Yukk, Ajukan pertanyaan! Like Terbanyak Akan Mendapatkan Hadiah😎
      </h2>

      <button
        className={`fixed z-50 flex items-center justify-center right-4 bottom-5 px-4 h-10 text-lg border bg-black text-white rounded-md w-32 focus:outline-none focus:ring focus:ring-blue-300 focus:bg-gray-800`}
        onClick={openModal}
      >
        Pertanyaan
      </button>
      {currentUsername === "ITPGo123" ? (
        ""
      ) : (
        <Modal
          isOpen={isModalOpen}
          isClosedQna={isStop}
          onClose={closeModal}
          section="qna"
          onSubmit={handleSubmit}
        />
      )}

      {data.length == 0 ? (
        <div className="mt-32">
          <h1 className="text-2xl font-semibold text-nowrap bg-white p-2 rounded-full">
            Belum Ada Data Pertanyaan 😣
          </h1>
        </div>
      ) : (
        <div className="grid xl:grid-cols-4 w-full mt-20 gap-2 gap-y-4 ">
          {data.map((item) => (
            <Card
              key={item.id}
              id={item.id}
              isStop={isStop}
              username={item.username}
              content={item.content}
              likes={item.likes}
            />
          ))}
        </div>
      )}
    </>
  );
}
