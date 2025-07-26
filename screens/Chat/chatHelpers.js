import { firestore } from './firebase';  
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';

const createChat = async (userEmail, mechanicEmail) => {
  const chatRef = collection(firestore, 'chats');
  const q = query(chatRef, where('userEmail', '==', userEmail), where('mechanicEmail', '==', mechanicEmail));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    await addDoc(chatRef, {
      userEmail: userEmail,
      mechanicEmail: mechanicEmail,
    });
  }
};

export { createChat };
