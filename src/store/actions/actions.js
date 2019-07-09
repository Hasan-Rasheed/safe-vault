import firebase from 'firebase'
import { func } from 'prop-types';
import history from '../../history';
// import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { Redirect } from 'react-router';



export function signinAction(user){
    // let that=this;
    return dispatch => {
        dispatch({ type: "ERROR_MESSAGE", payload: '' })
        // dispatch({ type: "SHOW_PROGRESS_BAR", payload: true })
    // firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    // .then((signedinUser) => {

        // let type;
        // firebase.database().ref('users/' + signedinUser.uid).once('value', (snapshot) => {
            // type = snapshot.val().type;
            // dispatch({ type: 'USER', payload: snapshot.val()})
            // // dispatch({ type: 'TYPE', payload : snapshot.val().type })
            // dispatch({ type: "CURRENT_USER_UID", payload: signedinUser.uid })
            //  dispatch({ type: "IS_LOGIN", payload: true })
                // console.log(signedinUser);
            //  history.push('/admin/index');
            // <Redirect from="/" to="/auth/login" />
            // post_request("/admin/index");

            
        //     case 'Landlord':
        //     history.push('/landlord');
        //     break;
        //     case 'Tenant':
        //     history.push('/tenant');
        //     break;
        // }
        // })
        // console.log("Hello")
        // })
    
    // .catch((err) => {
    //     // dispatch({ type: "SHOW_PROGRESS_BAR", payload: false })
    //     dispatch({ type: "ERROR_MESSAGE", payload: err.message })
    // })
}

}

export function signupAction(user){
    return dispatch => {
        dispatch({ type: "ERROR_MESSAGE", payload: '' })
        // dispatch({ type: "SHOW_PROGRESS_BAR", payload: true })
        dispatch({ type: 'USER_NAME', payload: user.userName })
   
        // user.uid = createdUser.uid;
        // firebase.database().ref('userData/' + createdUser.uid + '/').set(user)
        //     .then(() => {
        //         console.log("USER ADDED TO FIREBASE")
                // dispatch({ type: 'USER', payload: user})
                // dispatch({ type: 'CURRENT_USER_UID', payload: createdUser.uid })
                // dispatch({ type: "IS_LOGIN", payload: true })
                // dispatch({ type: "TYPE", payload: user.type })
                // switch(user.type){
                //     case 'Landlord':
                //     history.push('/landlord');
                //     break;
                //     case 'tenant':
                //     history.push('/Tenant');
                //     break;
                // }
    //         })

    // .catch((err) => {
        // dispatch({ type: "SHOW_PROGRESS_BAR", payload: false })
        // console.log(err)
    // })
}
}


export function putDataInStorage(name,file){
    firebase.storage.ref().child(name).put(file).then((snapshot)=>{
        console.log("data stored in storage: " +snapshot)
        downloadUrl()   
    }).catch(errr=>{
        console.log("data stored in storage: " +errr)
    })
}

export function signoutAction(){
    return dispatch => {

      dispatch({ type: "IS_LOGIN", payload: false })

    // firebase.auth().signOut().then(function () {
        // dispatch({ type: "SHOW_PROGRESS_BAR", payload: false })
        // dispatch({ type: "IS_LOGIN", payload: false })
        // Sign-out successful.
        // history.push('/signin');
        // console.log("sign out successfully")
    // }, function (error) {
    //     // An error happened.
    // });
}
}


export function downloadUrl(name){
    return dispatch => {
        

    firebase.storage.ref().child(name).getDownloadURL().then(url=>{
        console.log("downloadn Url: "+ url)
        dispatch({ type: "FILE_URL", payload: url })
        dispatch({ type: "FILE_Name", payload: name })

    }).catch(err=>{
        console.log("downloadn Url: "+err)
    })
}
}

export function putHashInDatabase(hash,url,fileName) {
    return dispatch => {

         firebase.database().ref('userData/'+firebase.auth().currentUser.uid+'/fileHash/'+hash).set({
        fileUrl: url,
        // dispatch({ type: 'FILE_URL' , payload: hash.url });
        name: fileName
    }).then(()=>{
        console.log("hash added")
    }).catch(()=>{
        console.log("error in uploading hash")
    })

    //comment faltu k :3 
}
} 

export function updateUserName(userName) {
    return dispatch => {
        dispatch({ type: "USER_NAME", payload: userName });

    }
}

export function readHashFromDatabase(){
    return dispatch => {
    firebase.database().ref('/userData/'+firebase.auth().currentUser.uid+'/fileHash/').on().then(snapshot=>{
        console.log("file hashes of user: "+snapshot.val())
        dispatch({ type: "FILE_Hash", payload: snapshot })

    }).catch(err =>{
        console.log("file hashes of user: "+err)
    })
}
}

export function getCurrentUserId(uid){
    console.log(uid,"uiddddd")
    return dispatch => {
        dispatch({ type: 'CURRENT_USER_UID', payload: uid })
    }
}
export function isFileSelected(selection){
    console.log(selection,"uiddddd")
    return dispatch => {
        dispatch({ type: 'IS_FILE_SELECTED', payload: selection })
    }
}
export function getNotification(notify){
    console.log(notify,"notification")
    return dispatch => {
        dispatch({ type: 'NOTIFICATION', payload: notify })
    }
}
export function getFileNames(filenames){
    console.log(filenames,"filenamesss")
    return dispatch => {
        dispatch({ type: 'FILE_NAMES', payload: filenames })
    }
}

export function getUserPrivateKey(key){
    console.log(key,"private Key")
    return dispatch => {
        dispatch({ type: 'Private_Key', payload: key })
    }
}

export function getAddress(address){
    console.log(address,"address")
    return dispatch => {
        dispatch({ type: 'ADDRESS', payload: address })
    }
}

export function errorMessage(msg) {
    return dispatch => {
        dispatch({ type: 'ERROR_MESSAGE', payload: msg })
    }
}
export function getFileHash(file_hash) {
    return dispatch => {
        dispatch({ type: 'File_Hash', payload: file_hash })
    }
}
export function checkIfHashExist(hash){
    firebase.database().ref('userData/'+firebase.auth().currentUser.uid+'/fileHash/'+hash).on('name').then(snapshot=>{
        if(snapshot.exists()){
            console.log("exists")
        }else{
            console.log(snapshot.val())
        }
    }).catch(err=>{
        console.log(err)
    })
}

export function isPaymentDone(payment){
    console.log(payment)
    return dispatch => {
        dispatch({ type: 'PAYMENT' , paylod: payment})
    }
}