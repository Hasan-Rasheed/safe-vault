import React, { Component } from "react";
import * as firebase from 'firebase/app';
import 'firebase/storage';
import CryptoJS from 'crypto-js';
import sha256 from 'sha256';
import { connect } from 'react-redux';
import { getCurrentUserId, errorMessage, getFileNames ,getFileHash ,getUserPrivateKey, isFileSelected, getAddress } from "../../store/actions/actions";
import Download from './Download'
import CreditCard from './CreditCardTransaction'
// import FileIcon, { defaultStyles } from 'react-file-icon';
import { Container, Row, Col } from 'react-grid-system';
import axios from 'axios'
import '../../assets/css/style.css';
// reactstrap components
import {api_url} from '../../config/api'
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
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
} from "reactstrap";

const utf8 = require('utf8');
var fileHash = '';
var keySize = 256;
var iterations = 100;
var fileName = ''
var fileContent = ''
// var fileLength = 0;
var encrypted = '';


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
      // privateKey: this.props.userPrivateKey,
      privateKey: '',
      fileList: [],
      extensions: [],
      // bgColor : "#e4ebee"
      active: null,
      Keyindex: '',
      data:'',
      flag:false
    }

    this.OnChangePrivateKey = this.OnChangePrivateKey.bind(this);


  }
   


  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };


  encrypt(msg, pass) {
    this.setState({ currentStatus: "Encrypting data. Please wait.." })

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


  onUploadData(event) {
    event.preventDefault();

    if (fileHash === '') {
      alert("Please select file to upload")
      return
    }
    console.log(this.state.privateKey, "password")
    if (this.state.privateKey === '') {
      alert("All the fields are required");
      return
    }
    else {
      // this.setState({flag : true})
      this.uploadFile()
    }
  }

  OnChangePrivateKey = (event) => {
    
      this.setState({privateKey:event.target.value })
      // this.props.userPrivateKey(event.target.value);
  }

  
  

  uploadFile = async () => {
    this.setState({ currentStatus: "Encrypting and uploading file. Please wait.." })
    console.log(fileContent);
    var encrypted = CryptoJS.AES.encrypt(fileContent, this.state.privateKey)

    var eFile = new File([encrypted.toString()], "file.encrypted", { type: "text/plain" })
    let eReader = new FileReader()
    eReader.readAsArrayBuffer(eFile)
    eReader.onloadend = (e) => {
      this.convertToBuffer(eReader)
    }

    //generating file hash
    console.log(fileName, "setting file name")
    //  let fileHash = sha256(file[0].name)
    console.log(fileHash);
    
  };

  captureFile = (event) => {
    event.stopPropagation()
    event.preventDefault()
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

  convertToBuffer = async (reader) => {
    let uid = this.props.currentUser;
    console.log(uid);
    const buffer = await Buffer.from(reader.result);
    this.setState({ buffer: buffer });
    let file = this.state.buffer;
    let that = this;
   
    console.log(fileHash)
    fileHash = JSON.stringify(fileHash);
    // alert("Do you want to continue")
    let obj={
      address:this.props.Address, 
      data:fileHash
    }
    await axios.post(api_url+'/sendHash' ,obj)
  .then(response => {
    alert("Your Transaction has been done ");
    var storageRef = firebase.storage().ref(uid)
   storageRef.child(this.state.HashStateMessage).put(file).then((snapshot) => {
      console.log('Uploaded a Blob or File');
      that.setState({ currentStatus: "File Uploaded" })
      firebase.firestore().collection('userData').doc(this.state.uid).update({
        files: firebase.firestore.FieldValue.arrayUnion(fileName)
  
      })
      // that.setState({fileList : fileName});
    }).catch(errr => {
      console.log("data storage error " + errr)
    })
    // console.log(response.data);
  })
  .catch(error => {
    alert("Your Transaction has been cancelled");
    // console.log(error);
  });
  };


  OnChangeData = (event) => {
    
    this.setState({data:event.target.value })
  }

  OnChangeKey = (event) => {
    
    this.setState({Keyindex:event.target.value })
  }


onSaveData(event) {
  event.preventDefault();

  console.log(this.state.privateKey, "password")
  if (this.state.privateKey === '') {
    alert("Enter you Private Key");
    return
  }
  else {
    this.encryptData();
  }
}

encryptData = () => {
  // this.setState({ currentStatus: "Encrypting and uploading file. Please wait.." })
  console.log(this.state.data);
 encrypted = CryptoJS.AES.encrypt(this.state.data, this.state.privateKey)
  console.log( encrypted.toString(), "encrypted data")
  console.log(this.props.Address,"address")
  let obj={
    address: this.props.Address,
    index:this.state.Keyindex,
    data:encrypted.toString()
  }
  console.log(obj)
  
  axios.post(api_url+'/sendData', obj)
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
  
};
  // handleLabelClick(filename){

  //   if (this.state.active === filename) {
  //     this.setState({active : null})
  //   } else {
  //     this.setState({active : filename})
  //   }
    
  //   console.log(filename)
  //   let file_Hash = sha256(utf8.encode(filename));
  //   console.log(file_Hash)
  //   this.props.getFileHash(file_Hash);
  //   this.props.isFileSelected(true);
  //   // this.setState({bgColor: "blue"})
    
  //   // <Download/>
  // }
  //   // console.log(filename)
  // myColor(filename) {
  //   if (this.state.active === filename) {
  //     return "#b2b2e0";
  //   }
  //   return "";
  // }
  // fileExtension = (file) => {
  //   let extension = file.slice((file.lastIndexOf(".") - 1 >>> 0) + 2);
  //   return (
  //    <FileIcon style={{ align :'center'}} color = "#e4ebee" extension = {extension} {...defaultStyles[extension]} className = "card-icon"  size={50} /> 
  //   )
  // }

  render() {
    const {
      encryptionKey,
    } = this.state;

    return (
      
      <div className = "form-styling ">
        <br/>        <br/>

       <Container>
        <Row>

       {/* {(this.state.flag)?(<CreditCard/>):(null)}  */}
       <Col lg= {6} md = {6} xsm={6} className = "form-style">
        <form className='add-product button-alignment' onSubmit={this.onUploadData.bind(this)}>
          <div className='form-group'>
          <h1>Upload Files</h1>
            <Input
              type='file'
              ref='myFile'
              multiple="multiple"
              // onChange={(e) => this.onFileChange(e)}
              onChange={this.captureFile}
              className='form-control' />

          <br/>

          <Input 
          type = 'password'
          className = 'form-control'
          onChange = {this.OnChangePrivateKey}
          placeholder = 'Enter Your Private Key to Encrypt the Data'
          />
</div>
          
          <CreditCard/>
          <br />
          <label style={{ fontSize: '20px', color: 'blue' }}>{this.state.currentStatus}</label>
          <br />

        </form>
</Col>
        {/* <br /> */}
   <Col lg = {6} md = {6} sm={6} className = "form-style">    
        <form className='add-product button-alignment' onSubmit={this.onSaveData.bind(this)}>
      <div className = "form-group ">
      <h1>Data Write</h1>
          <input 
          type = 'password'
          className = 'form-control'
          onChange = {this.OnChangePrivateKey.bind(this)}
          placeholder = 'Enter Your Private Key to Encrypt the Data'
          />
          <br/>
          <input 
          type = 'text'
          className = 'form-control'
          onChange = {this.OnChangeKey.bind(this)}
          placeholder = 'Index'
          />
          <br/>
          <Input type="textarea" name="text" id="exampleText" 
          placeholder = 'Your Text'
          onChange={this.OnChangeData.bind(this)}
          />
          <br/>
          <button
              className = "button-styling"
            // color="primary"
            type="submit" name="action"
            title='submit'
            // onClick = {this.onSave}

          >
            {/* <CreditCard/> */}
           <span className = "button-span"> Save</span>
        </button>
        {/* <hr/> */}
        </div>
</form>

  </Col>
  </Row>
</Container>
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
    userPrivateKey : state.root.userprivatekey,
    notification: state.root.notify,
    Address: state.root.address,
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
    userPrivateKey : (key) => {
      dispatch(getUserPrivateKey(key))
    },
    isFileSelected: (selection) => {
      dispatch(isFileSelected(selection));
    },
    userAddress: (address) => {
      dispatch(getAddress(address));
    }
    
  })
}
export default connect(mapStateToProp, mapDispatchToProp)(UploadFiles);
