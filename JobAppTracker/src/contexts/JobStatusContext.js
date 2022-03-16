import { View, Text } from 'react-native'
import React, {createContext, useState, useEffect, useContext} from 'react'
import { db } from '../../firebase';
import { addDoc, collection, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
import { AuthContext } from './AuthContext';

export const JobStatusContext = createContext();

export const JobStatusContextProvider = ({children}) =>{

    const {user} = useContext(AuthContext)
    const jobsCollectionRef = collection(db, "JobStatusCollection")
    const [jobDoc, setJobDoc] = useState({}) // get data and store from database
    // const [appJobs, setAppJobs] = useState({ "auth_ID":user.uid, "companyName":"", "jobName":"", "status":"", "note":"" })

    // create new jobs status
    const createJobStatus = async (appJobs)=> {
        // const jobDoc = doc(db, "JobStatusCollection", "JSDocument")

        try {
            const docRef = await addDoc(jobsCollectionRef , appJobs);
            // console.log(appJobs);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }    

    //real time database listner :
    const getJobStatusSnapshot = ()=> {

        const que = query(jobsCollectionRef, where("auth_ID", "==", user.uid))
        const unsubscribe = onSnapshot(que, (querySnapshot) => {
        const temp = [];
        querySnapshot.forEach((doc) => {
            // cities.push(doc.data());
            temp.push({...doc.data(), id:doc.id})
            // console.log({...doc.data(), id:doc.id})
            setJobDoc(temp)
        });
        
        })
        unsubscribe();
    
    }

    useEffect(()=>{
        getJobStatusSnapshot()
    },[user])

    console.log(jobDoc)
    // Delelete Job status
    const deleteJobStatus = async (id)=>{
        try{
        const delDoc = await deleteDoc(doc(db,"JobStatusCollection", id))
        console.log(id)
        }catch(err){
        console.log(err.message)
        }
        
    }

    // useEffect(()=>{
    //     deleteJobStatus()
    // },[])


    return(
        <JobStatusContext.Provider 
            value={{ jobDoc ,createJobStatus, deleteJobStatus }} >
            {children}
        </JobStatusContext.Provider>

    )
}