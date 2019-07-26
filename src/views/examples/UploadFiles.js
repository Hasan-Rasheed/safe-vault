import React, { Component } from "react";
import * as firebase from 'firebase/app';
import 'firebase/storage';
import CryptoJS from 'crypto-js';
import sha256 from 'sha256';
import { connect } from 'react-redux';
import { getCurrentUserId, errorMessage, getFileNames, getFileHash, isPaymentDone, isIndexWritten, isDataWritten, getUserPrivateKey, isWritePaymentDone, isFileSelected, getAddress, isFileChosen } from "../../store/actions/actions";
import CreditCard from './CreditCardTransaction'
import CreditCardWrite from './CreditCardWrite'
import {
  Button,
  Card,
  CardImg,
  CardText,
  CardBody,
  CardLink,
  CardTitle,
  CardSubtitle,
  FormGroup,
  Form,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
} from "reactstrap";
import { Container, Row, Col, Hidden } from 'react-grid-system';
import axios from 'axios'
import '../../assets/css/style.css';
import { api_url } from '../../config/api'
import {
  Input,
} from "reactstrap";
import loader from '../../assets/img/icons/Spinner.gif';

const utf8 = require('utf8');
var fileHash = '';
var keySize = 256;
var iterations = 100;
var fileName = ''
var fileContent = ''
var encrypted = ''
var object ;

class UploadFiles extends Component {

  constructor(props) {
    super(props);
    this.state = {
      buffer: '',
      currentStatus: '',
      HashStateMessage: '',
      transactionHash: '',
      open: false,
      uid: this.props.currentUser,
      privateKey: '',
      fileList: [],
      extensions: [],
      active: null,
      Keyindex: '',
      data: '',
      flag: false,
      payment: this.props.payment,
      currentWriteStatus: '',
      loading: '',
      loadingWrite: '',
      FileChosen: false,
      dataWritten: false,
      indexWritten: false,
      fileKey: '',
      BothExist: false

    }



  }




  componentWillMount() {
    // this.loading = this.loading.bind(this);
    this.setState({ loading: false })

  }

  componentWillReceiveProps(nextprops) {
    console.log(nextprops)
    console.log(nextprops.payment)
    // console.log("i am at CWRP")
    // console.log(nextprops.writepayment)
    if (nextprops.payment && this.props.fileChosen && this.props.dataWritten) {
      alert("both are working")

    this.setState({BothExist: true})

    // alert("Do you want to upload both ")
    console.log(this.state.BothExist , "Both exist")
    this.setState({payment: nextprops.payment})
    this.transactionSuccessful(nextprops.payment , true)
      //  this.onSaveData(nextprops.payment)
      // this.onSavingBothDataAndFile(nextprops.payment)
    }
    else if (nextprops.payment && this.props.fileChosen && !this.props.dataWritten) {
      alert("FIle uploading working")
      this.transactionSuccessful(nextprops.payment ,  this.state.BothExist)
    }
    else if (nextprops.payment && this.props.dataWritten && !this.props.fileChosen) {
      alert("Data saving working")
      // console.log(nextprops.writepayment)
      this.onSaveData(nextprops.payment , this.state.BothExist)
    }
  }
onSaveDataAndFile(obj){
  let file = this.state.buffer;
  let that = this;
  let uid = this.props.currentUser;

        console.log(obj, "data object")
        console.log(object , "file object")

        delete object.address;
        let obj2= {...object , ...obj }
        // obj2.push(obj)
        console.log(obj2)


        axios.post(api_url + '/sendDataAndHash', obj2)

      .then(response => {
        console.log(response)
        alert("Your Transaction has been done ");

        var storageRef = firebase.storage().ref(uid)
        var db=firebase.firestore()
        storageRef.child(this.state.HashStateMessage).put(file).then((snapshot) => {
          console.log('Uploaded a Blob or File');
          that.setState({ currentStatus: "File Uploaded" , privateKey: '' ,fileKey: Date.now() })
          console.log(this.state.uid)
          console.log(fileName)
          db.collection("userData").doc(this.state.uid).update({
            // {console.log()}
            files: firebase.firestore.FieldValue.arrayUnion(fileName)
            
          }).then(function() {
            console.log("Document successfully updated!");
        })
        .catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
        that.setState({ loading: false   });
        // that.props.isPaymentDone(false)
        that.props.isFileChosen(false)
          })

          that.setState({ loadingWrite: false  })

        that.setState({ currentWriteStatus: "Your Data has been saved" , privateKey:'' , Keyindex: '' , data:'' })
        that.props.isPaymentDone(false)
        that.props.isDataWritten(false)
        that.props.isIndexWritten(false)
        
        console.log(response);
          // that.setState({fileList : fileName});
        }).catch(errr => {
          alert("Something went wrong with the firebase please try again")

          that.setState({  loading: false, currentStatus: "" })
          that.props.isPaymentDone(false)
          that.props.isFileChosen(false)
          console.log("data storage error " + errr)
        })



        
      .catch(error => {
        that.setState({ currentStatus: "Waiting for the Response of Transaction" })
        that.setState({ loading: true });
        alert("Your Transaction has been cancelled");
        
        that.setState({ currentStatus: "" })
        that.setState({ loading: false  });
        that.props.isPaymentDone(false)
        that.props.isFileChosen(false)


        // console.log(error);
      });


}
  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  onSavingBothDataAndFile(obj){
    console.log(obj)
    object = obj
console.log(this.state.payment)
this.onSaveData(this.state.payment , this.state.BothExist)

  }

  encrypt(msg, pass) {
    this.setState({ currentStatus: "Encrypting data. Please wait.." })
    this.setState({ loading: true });

    var salt = CryptoJS.lib.WordArray.random(128 / 8);
    var key = CryptoJS.PBKDF2(pass, salt, {
      keySize: keySize / 32,
      iterations: iterations
    });

    var iv = CryptoJS.lib.WordArray.random(128 / 8);
    var encrypted = CryptoJS.AES.encrypt(msg, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC

    });

    var transitmessage = salt.toString() + iv.toString() + encrypted.toString();
    return transitmessage;
  }


  onUploadData(trans , BothExist) {
    let that = this;
    // event.preventDefault();
    console.log(this.state.privateKey, "password")
    console.log(trans, "payment props")
    if (fileHash === '') {
      alert("Please select file to upload")
      return
    }
    else if (this.state.privateKey === '') {
      alert("All the fields are required");
      return
    }
    else if (trans ) {
      this.uploadFile(BothExist)
    }

  }


  OnChangePrivateKey = (event) => {

    this.setState({ privateKey: event.target.value  ,  currentWriteStatus: ""})
    this.props.userPrivateKey(event.target.value);
  }

  uploadFile = async (BothExist) => {
    this.setState({ currentStatus: "Encrypting and uploading file. Please wait.." })
    this.setState({ loading: true });

    console.log(fileContent);
    var encrypted = CryptoJS.AES.encrypt(fileContent, this.state.privateKey)

    var eFile = new File([encrypted.toString()], "file.encrypted", { type: "text/plain" })
    let eReader = new FileReader()
    eReader.readAsArrayBuffer(eFile)
    eReader.onloadend = (e) => {
      this.convertToBuffer(eReader , BothExist)
    }

    console.log(fileName, "setting file name")

    console.log(fileHash, "on upload file");

  };

  captureFile = (event) => {
    event.stopPropagation()
    event.preventDefault()
    this.setState({ FileChosen: true })
    this.props.isFileChosen(true)
    const file = event.target.files[0]
    fileName = file.name;
    let reader = new window.FileReader()
    reader.readAsDataURL(file)

    reader.onloadend = (e) => {
      fileContent = e.target.result;

      fileHash = sha256(utf8.encode(fileName));
      console.log(fileHash)
      this.setState({ HashStateMessage: fileHash })

    }
   

  };

  convertToBuffer = async (reader , BothExist) => {
    let uid = this.props.currentUser;
    console.log(uid);
    const buffer = await Buffer.from(reader.result);
    this.setState({ buffer: buffer });
    let file = this.state.buffer;
    let that = this;

    console.log(fileHash)

    let obj = {
      address: this.props.Address,
      hash: fileHash
    }

    console.log(obj)

    // let that = this;
    if(BothExist){
  
        this.onSavingBothDataAndFile(obj)
    }
    else{
    await axios.post(api_url + '/sendHash', obj)

      .then(response => {
        console.log(response)
        alert("Your Transaction has been done ");

        var storageRef = firebase.storage().ref(uid)
        var db=firebase.firestore()
        storageRef.child(this.state.HashStateMessage).put(file).then((snapshot) => {
          console.log('Uploaded a Blob or File');
          that.setState({ currentStatus: "File Uploaded" , privateKey: '' ,fileKey: Date.now() })
          console.log(this.state.uid)
          console.log(fileName)
          db.collection("userData").doc(this.state.uid).update({
            // {console.log()}
            files: firebase.firestore.FieldValue.arrayUnion(fileName)
            
          }).then(function() {
            console.log("Document successfully updated!");
        })
        .catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
        that.setState({ loading: false   });
        that.props.isPaymentDone(false)
        that.props.isFileChosen(false)
          })

         
          // that.setState({fileList : fileName});
        }).catch(errr => {
          alert("Something went wrong with the firebase please try again")

          that.setState({  loading: false, currentStatus: "" })
          that.props.isPaymentDone(false)
          that.props.isFileChosen(false)
          console.log("data storage error " + errr)
        })

        
      .catch(error => {
        that.setState({ currentStatus: "Waiting for the Response of Transaction" })
        that.setState({ loading: true });
        alert("Your Transaction has been cancelled");
        
        that.setState({ currentStatus: "" })
        that.setState({ loading: false  });
        that.props.isPaymentDone(false)
        that.props.isFileChosen(false)


        // console.log(error);
      });
    }
  };


  OnChangeData(event) {
    console.log(event.target.value.length)
    this.setState({ data: event.target.value ,  currentWriteStatus: ""})
    if (event.target.value.length == 0) {
      this.props.isDataWritten(false)
    }
    else {
      this.props.isDataWritten(true)

    }
  }

  OnChangeKey(event) {
    // this.setState({ currentWriteStatus: "Encrypting..." })
    this.setState({ Keyindex: event.target.value , currentWriteStatus: ""})
    if (event.target.value.length == 0) {
      this.props.isIndexWritten(false)
    }
    else {
      this.props.isIndexWritten(true)

    }

  }


  onSaveData(trans , BothExist) {
    let that = this
    // event.preventDefault();

    console.log(this.state.privateKey, "password")
    if (this.state.privateKey === '') {
      alert("Enter you Private Key");
      return
    }
    else if (this.state.Keyindex === '') {
      alert("Enter you Index Key");
      return
    }
    else if (this.state.data === '') {
      alert("Please Enter you Text")
      return
    }
    else if (trans) {
      this.setState({ dataWritten: true })
      // this.props.isDataWritten(true)
      // this.props.isIndexWritten(true)
      console.log(BothExist)
      this.encryptData(BothExist);
    }

  }


  encryptData = (BothExist) => {
    this.setState({ currentWriteStatus: "Encrypting..." , loadingWrite: true })
    // this.setState({ loadingWrite: true });

    console.log(this.state.data);
    encrypted = CryptoJS.AES.encrypt(this.state.data, this.state.privateKey)
    console.log(encrypted.toString(), "encrypted data")
    console.log(this.props.Address, "address")
    let obj = {
      address: this.props.Address,
      index: this.state.Keyindex,
      data: encrypted.toString()
    }


    let that = this;

    console.log(obj)
    that.setState({ currentWriteStatus: "Waiting for the Response " })
    that.setState({ loadingWrite: true });
if(BothExist){
        this.onSaveDataAndFile(obj)
}
else{
    axios.post(api_url + '/sendData', obj)
      .then(function (response) {
        that.setState({ loadingWrite: false  })

        that.setState({ currentWriteStatus: "Your Data has been saved" , privateKey:'' , Keyindex: '' , data:'' })
        that.props.isPaymentDone(false)
        that.props.isDataWritten(false)
        that.props.isIndexWritten(false)
        
        console.log(response);
      })

      .catch(function (error) {
        alert("Your Transaction has been cancelled");
        that.setState({ currentStatus: "MetaMask Transaction Failed" })
        that.setState({ loadingWrite: false });
        that.props.isPaymentDone(false)
        that.props.isDataWritten(false)
        that.props.isIndexWritten(false)
        // that.props.isFileChosen(false)
        console.log(error);
      });
    }
  }

  transactionSuccessful(trans , BothExist) {
    console.log(trans, "transaction")
    console.log(BothExist, "both existing")
    this.onUploadData(trans , BothExist)
    // this.onSaveData()
  }



  render() {
    const {
      encryptionKey,
    } = this.state;

    return (

      <div className="form-styling ">



        <div className='add-product button-alignment' >
          
          {/* <div className='add-product button-alignment'> */}
          <h1 className="heading">Write Data</h1>
          <br/>
          <input
            type='password'
            className='form-control'
            onChange={this.OnChangePrivateKey.bind(this)}
            placeholder='Enter Your Private Key to Encrypt the Data'
            value={this.state.privateKey}
          />
          <br />
          <input
            type='text'
            className='form-control'
            onChange={this.OnChangeKey.bind(this)}
            placeholder='Index'
            value = {this.state.Keyindex}
          />
          <br />
          <textarea name="text" id="exampleText"
            placeholder='Your Text'
            onChange={this.OnChangeData.bind(this)}
            value = {this.state.data}
            className='form-control'

            rows = "10"
            cols = "92"
            style = {{resize: 'none'}}
          />
          <br />
          <span style={{ fontSize: '20px', color: 'blue' }}>{this.state.currentWriteStatus}{this.state.loadingWrite && <img src={loader} style={{ height: "2em" }} />}</span>

          <br />

          <h1 className="heading" >Upload Files</h1>

          <br />
          <Input
            type='file'
            ref='myFile'
            multiple="multiple"
            key = {this.state.fileKey}
            onChange={this.captureFile}
            className='form-control'
            style = {{height : 'auto'}}
            // value ={this.state.filenaaam}
             />
            <br/>

          <CreditCard />


          <br />
          <label style={{ fontSize: '20px', color: 'blue' }}>{this.state.currentStatus}{this.state.loading && <img src={loader} style={{ height: "2em" }} />}</label>

<br/>
        </div>


      </div>

    );
  }
}

function mapStateToProp(state) {
  console.log(state)
  return ({
    // progressBarDisplay: state.root.progressBarDisplay,
    errorMsg: state.root.errorMessage,
    currentUser: state.root.userID,
    userPrivateKey: state.root.userprivatekey,
    notification: state.root.notify,
    Address: state.root.address,
    payment: state.root.payment,
    // writepayment: state.root.writepayment,
    dataWritten: state.root.datawritten,
    fileChosen: state.root.filechosen

  })
}

function mapDispatchToProp(dispatch) {

  return ({
    signOut: (user) => {
      // dispatch(signoutAction())
    },
    errorMessage: (message) => {
      dispatch(errorMessage(message));
    },
    getCurrentUserId: (user) => {
      dispatch(getCurrentUserId(user));
    },
    getFileNames: (filenames) => {
      dispatch(getFileNames(filenames));
    },
    getFileHash: (file_hash) => {
      dispatch(getFileHash(file_hash));
    },
    userPrivateKey: (key) => {
      dispatch(getUserPrivateKey(key))
    },
    isFileSelected: (selection) => {
      dispatch(isFileSelected(selection));
    },
    userAddress: (address) => {
      dispatch(getAddress(address));
    },
    isPaymentDone: (transaction) => {
      dispatch(isPaymentDone(transaction));
    },
    isFileChosen: (chosen) => {
      dispatch(isFileChosen(chosen));
    },
    isDataWritten: (written) => {
      dispatch(isDataWritten(written));
    },
    isIndexWritten: (indexwritten) => {
      dispatch(isIndexWritten(indexwritten));
    }
  })
}
export default connect(mapStateToProp, mapDispatchToProp)(UploadFiles);
