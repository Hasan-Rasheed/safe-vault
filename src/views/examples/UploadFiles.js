import React, { Component } from "react";
// import firebase  from 'firebase';
import * as firebase from 'firebase/app';
// import 'firebase/storage';
import 'firebase/storage';
import { Button } from "reactstrap";
import CryptoJS from 'crypto-js';
import sha256 from 'sha256';
// import {} from '../../store/actions/actions';
import { connect } from 'react-redux';
import { getCurrentUserId , errorMessage } from "../../store/actions/actions";
import Download from './Download'


var keySize = 256;
var ivSize = 128;
var iterations = 100;
// var privateKey = ''

class UploadFiles extends Component{
  // static contextTypes = {
  //   encrypt: PropTypes.func.isRequired,
  //   decrypt: PropTypes.func.isRequired,
  // }
    constructor(props){
        super(props);
        // super(props)
    this.state = { valid: false,
                    file : "",
                    fileData: "",
                    encryptedFile : "",
                    encryptionKey:"",
                    fileHash: "",
                  // image : null 
                }
                  
        // this.onFileChange = this.onFileChange.bind(this)
        // this.putDataInStorage = this.putDataInStorage.bind(this);
        // this.downloadUrl = this.downloadUrl.bind(this);
        this.onButtonClick = this.onButtonClick.bind(this);
        
    }
 onFileChange(e) {
     let files = e.target.files;
    //  console.log(files);
      this.setState({file : files});
    //        let reader = new FileReader();
    //  reader.readAsText(files[0]);
    //  reader.onload = (e) => {
    //      console.log("file data" , e.target.result)
    //      this.setState({fileData : e.target.result})
    //      console.log(this.state.fileData)

    //     //  this.encrypt(e.target.result,privateKey);

    // }
    //     if (e.target.files[0]) {
    //       const image = e.target.files[0]
    //       this.setState(() => ({image}));
    //       this.setState( {valid: true} )

    //     } else {
    //       this.setState( {valid: false} )
    //     }
      }
      onPrivateKeyChange(e) {
        let key = e.target.value;

        console.log(key);  
        this.setState({encryptionKey :  key});
    }
    
    encrypt (msg, pass) {
      var salt = CryptoJS.lib.WordArray.random(128/8);
      
      var key = CryptoJS.PBKDF2(pass, salt, {
          keySize: keySize/32,
          iterations: iterations
        });
    
      var iv = CryptoJS.lib.WordArray.random(128/8);
      
      var encrypted = CryptoJS.AES.encrypt(msg, key, { 
        iv: iv, 
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
        
      });
      
      // salt, iv will be hex 32 in length
      // append them to the ciphertext for use  in decryption
      var transitmessage = salt.toString()+ iv.toString() + encrypted.toString();
      return transitmessage;
    }
    
    //  decrypt (transitmessage, pass) {
    //   var salt = CryptoJS.enc.Hex.parse(transitmessage.substr(0, 32));
    //   var iv = CryptoJS.enc.Hex.parse(transitmessage.substr(32, 32))
    //   var encrypted = transitmessage.substring(64);
      
    //   var key = CryptoJS.PBKDF2(pass, salt, {
    //       keySize: keySize/32,
    //       iterations: iterations
    //     });
    
    //   var decrypted = CryptoJS.AES.decrypt(encrypted, key, { 
    //     iv: iv, 
    //     padding: CryptoJS.pad.Pkcs7,
    //     mode: CryptoJS.mode.CBC
        
    //   })
    //   return decrypted;
    // }
    
//  putDataInStorage(name,file){
//     // preventDefault()

//         firebase.storage.ref().child(name).put(file).then((snapshot)=>{
//             console.log("data stored in storage: " +snapshot)
//             this.downloadUrl()   
//         }).catch(errr=>{
//             console.log("data stored in storage: " +errr)
//         })
//     }

// convertToBuffer = async (reader) => {
//   console.log(reader.result , "hasassaas")
//   const buffer = await Buffer.from(reader.result);
//   console.log(buffer, "lollllllll");
//   console.log(this.state.file);
//   this.setState({file: buffer});
//   console.log(this.state.file);
  
// }

  
async onButtonClick() {
  console.log(this.state.fileData);
  let data = this.state.fileData;
  let key = this.state.encryptionKey;
  let encrypted = "";
  let file = this.state.file;
  let uid = this.props.currentUser;

    //encrypting the data
    console.log(file , "file object")
    encrypted = this.encrypt(data,key);
    console.log(encrypted);
    this.setState({encryptedFile : encrypted});

  var encryptedFile = new File([encrypted.toString()], "file.encrypted", {type: "text/plain"})

  console.log(encryptedFile,"hellooo")
  this.setState({file: encryptedFile})
        // let eReader = new FileReader()
        // eReader.readAsArrayBuffer(eFile)
        // eReader.onloadend = (e) => {
        //     this.convertToBuffer(eReader)
        // }

    //generating file hash
      let hash = sha256(file[0].name)
      console.log(hash);
      this.setState({fileHash : hash });
console.log(uid)
var storageRef = firebase.storage().ref(uid)
var uploadTask = await storageRef.child(hash).put(encryptedFile).then((snapshot)=>{
  console.log("data stored in storage: " +snapshot)
  // this.downloadUrl(hash)   
}).catch(errr=>{
  console.log("data stored in storage: " +errr)
})

// Since you mentioned your images are in a folder,
// we'll create a Reference to that folder:
console.log(uid)
var storageRef = firebase.storage().ref(uid);


// Now we get the references of these images
storageRef.listAll().then(function(result) {
  result.items.forEach(function(itemslist) {
    // And finally display them
    console.log("ooo")
    displayImage(itemslist);
  });
}).catch(function(error) {
  // Handle any errors
});

function displayImage(itemlist) {
  itemlist.getDownloadURL().then(function(url) {
    // TODO: Display the image on the UI
    console.log(url,"listofItemssss")
  }).catch(function(error) {

    // Handle any errors
    console.log("erorrrrrssss")
  });
}

//  this.downloadUrl(hash);


// console.log(JSON.stringify(firebase.storage))
// uploadTask.on('state_change',
// (snapshot) => {
// console.log('hi');
// }
// ,(error) => {
//   console.log(error);
// },() => {
//  firebase.storage.ref('files ').child(file[0].name).getDownloadURL().then(url =>{
//    console.log(url)
//  }) 
// })
// var storageRef = firebase.storage().ref();
// var sRef = storageRef.child('images');
//   firebase.storage.ref('Files').child(uid).put(file).then((snapshot)=>{
//     console.log("data stored in storage: " +snapshot)
//   })
  
  // encrypted = this.encrypt(data,key);
  // console.log(encrypted);

  // let hash = sha256(encrypted)
  // console.log(hash);
  // this.setState({fileHash : hash });

  }


  // var eFile = new File([encrypted.toString()], "file.encrypted", { type: "text/plain" })
  //       let eReader = new FileReader()
  //       eReader.readAsArrayBuffer(eFile)
  //       eReader.onloadend = (e) => {
  //           this.convertToBuffer(eReader)
  //       }
      
    
  //  downloadUrl(hash){
        // return dispatch => {
      //       let uid = this.props.currentUser;
      //       console.log(uid)
      //       // let hash = this.state.fileHash
      //   var storageRef = firebase.storage().ref(uid);
      //   storageRef.child(hash).getDownloadURL().then(url=>{
      //       console.log(url , "url is here")
      //   //     // dispatch({ type: "FILE_URL", payload: url })
      //   //     // dispatch({ type: "FILE_Name", payload: name })
    
      //   }).catch(err=>{
      //       console.log(err,"url error")
      //   })

      //   var link = document.createElement("a");
      //       link.href = this.url;
      //       document.body.appendChild(link);

      // var request = new XMLHttpRequest();
      // request.open('GET', link.href, true);
      // request.responseType = 'blob';
      // request.onload = () => {
      //     var eReader = new FileReader();
      //     eReader.readAsText(request.response);
      //     eReader.onload = (e) => {
      //         this.setState({currentStatus: "Decrypting file. Please wait.."})
      //         var decrypted = CryptoJS.AES.decrypt(e.target.result, privateKey).toString(CryptoJS.enc.Latin1);
      //         var a = document.createElement("a");
      //         a.href = decrypted;

      //         if (!decrypted.toString().includes("data")) {
      //             alert("Error in decryption. Most likely caused by the wrong private key.")
      //             return;
      //         }

      //         let split1 = decrypted.toString().split("data:")
      //         let split2 = split1[1].split(";base64")
      //         let type = split2[0]

      //         a.download = fileHash;
      //         document.body.appendChild(a);
      //         a.click();

      //         this.setState({currentStatus: "File downloaded."})
      //     };
      // };
      // request.send();
    // }

  //   onDownloadFile(event) {
  //     event.preventDefault();
  //     if (privateKey === '') {
  //         alert("Incorrect Private key")
  //         return
  //     }

  //     this.setState({currentStatus: "Downloading file. Please wait.."})
  //     var link = document.createElement("a");
  //     link.href = 'https://firebasestorage.googleapis.com/v0/b/safe-vault-with-tokens.appspot.com/o/' + fileHash + "?alt=media&token=234ab920-5365-45f9-8f23-37100eef24ad";
  //     document.body.appendChild(link);

  //     var request = new XMLHttpRequest();
  //     request.open('GET', link.href, true);
  //     request.responseType = 'blob';
  //     request.onload = () => {
  //         var eReader = new FileReader();
  //         eReader.readAsText(request.response);
  //         eReader.onload = (e) => {
  //             this.setState({currentStatus: "Decrypting file. Please wait.."})
  //             var decrypted = CryptoJS.AES.decrypt(e.target.result, privateKey).toString(CryptoJS.enc.Latin1);
  //             var a = document.createElement("a");
  //             a.href = decrypted;

  //             if (!decrypted.toString().includes("data")) {
  //                 alert("Error in decryption. Most likely caused by the wrong private key.")
  //                 return;
  //             }

  //             let split1 = decrypted.toString().split("data:")
  //             let split2 = split1[1].split(";base64")
  //             let type = split2[0]

  //             a.download = fileHash;
  //             document.body.appendChild(a);
  //             a.click();

  //             this.setState({currentStatus: "File downloaded."})
  //         };
  //     };
  //     request.send();
  // }
    
render(){
  const {
    encryptionKey,
  } = this.state;


  const {
    encrypt,
    decrypt,
  } = this.context;

    return(
      <div>
<form className='add-product'>
        <div className='form-group'>
          <input
            type='file'
            ref='myFile'
            multiple="multiple"
            onChange={(e) => this.onFileChange(e)}
            className='form-control' />
             <input
            type='text'
            placeholder =  'enter you private key here to encrypt'
            onChange = {(e) => this.onPrivateKeyChange(e)}
            className='form-control' />
            
            
        </div>
        
        <Button
        //   type='button'
          // disabled={!this.state.valid}
          color = "primary" onClick = {(e) => this.onButtonClick()}>
          Upload
        </Button>
      </form>


      {/* <Download/> */}


      </div>
    );
      // let filename = file[0].name;
      // <label value = {this.state.file[0].name} ></label>
      // <Button
      //   //   type='button'
      //     // disabled={!this.state.valid}
      //     color = "primary" onClick = {(e) => this.onDownloadButtonClick()}>
      //     Upload
      //   </Button>

    
}
}

function mapStateToProp(state) {
  console.log(state)
  return ({
      // progressBarDisplay: state.root.progressBarDisplay,
      errorMsg : state.root.errorMessage,
      currentUser : state.root.userID
  })
}

function mapDispatchToProp(dispatch) {
  return ({
      signOut: (user) => {
          // dispatch(signoutAction())
      },
      errorMessage: (message)=>{
          dispatch(errorMessage(message));
      },
      getCurrentUserId : (user) => {
        dispatch(getCurrentUserId(user));
      }
  })
}
export default connect(mapStateToProp, mapDispatchToProp)(UploadFiles);
