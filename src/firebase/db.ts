import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  serverTimestamp, 
  orderBy, 
  query, 
  Timestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './config';

export type ComplaintStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';

export interface ComplaintData {
  id?: string;
  fullName: string;
  mobileNumber: string;
  wardNumber: string;
  category: string;
  description: string;
  photoUrl?: string;
  location?: string;
  status: ComplaintStatus;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

// Fallback to local storage if Firebase is not configured
const LOCAL_STORAGE_KEY = 'mock_complaints_db';

const getMockData = (): ComplaintData[] => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data).map((item: any) => ({
        ...item,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      }));
    } catch (e) {
      return [];
    }
  }
  return [];
};

const saveMockData = (data: ComplaintData[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
};

export const submitComplaint = async (data: Omit<ComplaintData, 'status' | 'createdAt' | 'updatedAt' | 'id'>, imageFile?: File): Promise<string> => {
  let photoUrl = '';

  if (storage && imageFile) {
    const fileRef = ref(storage, `complaints/${Date.now()}_${imageFile.name}`);
    await uploadBytes(fileRef, imageFile);
    photoUrl = await getDownloadURL(fileRef);
  } else if (imageFile) {
    // Mock local Object URL if no Firebase
    photoUrl = URL.createObjectURL(imageFile);
  }

  const newDoc = {
    ...data,
    photoUrl,
    status: 'PENDING' as ComplaintStatus,
  };

  if (db) {
    const docRef = await addDoc(collection(db, 'complaints'), {
      ...newDoc,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } else {
    // Mock save
    const currentData = getMockData();
    const id = Date.now().toString();
    currentData.push({
      ...newDoc,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    saveMockData(currentData);
    
    // Optional Email Notification via Web3Forms
    const web3formsAccessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
    if (web3formsAccessKey) {
      try {
        await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            access_key: web3formsAccessKey,
            subject: `New TVK Report from ${data.fullName}`,
            from_name: "Melvisharam TVK Maiyam",
            name: data.fullName,
            phone: data.mobileNumber,
            ward: data.wardNumber,
            category: data.category,
            description: data.description,
            location: data.location || "Not Provided"
          }),
        });
      } catch (err) {
        console.error("Failed to send email notification", err);
      }
    }

    return id;
  }
};

export const getComplaints = async (): Promise<ComplaintData[]> => {
  if (db) {
    const q = query(collection(db, 'complaints'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as ComplaintData;
    });
  } else {
    // Mock fetch
    const data = getMockData();
    // Sort descending
    return data.sort((a, b) => (b.createdAt as Date).getTime() - (a.createdAt as Date).getTime());
  }
};

export const updateComplaintStatus = async (id: string, newStatus: ComplaintStatus): Promise<void> => {
  if (db) {
    const docRef = doc(db, 'complaints', id);
    await updateDoc(docRef, {
      status: newStatus,
      updatedAt: serverTimestamp()
    });
  } else {
    // Mock update
    const currentData = getMockData();
    const index = currentData.findIndex(item => item.id === id);
    if (index !== -1) {
      currentData[index].status = newStatus;
      currentData[index].updatedAt = new Date();
      saveMockData(currentData);
    }
  }
};
