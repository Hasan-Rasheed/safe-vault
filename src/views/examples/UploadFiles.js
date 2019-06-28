import React, { Component } from "react";
import * as firebase from 'firebase/app';
import 'firebase/storage';
import CryptoJS from 'crypto-js';
import sha256 from 'sha256';
import { connect } from 'react-redux';
import { getCurrentUserId, errorMessage, getFileNames ,getFileHash , isFileSelected } from "../../store/actions/actions";
import Download from './Download'
import FileIcon, { defaultStyles } from 'react-file-icon';
import { Container, Row, Col } from 'react-grid-system';
import '../../assets/css/FileList.css';
// reactstrap components
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
var fileLength = 0;

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
      privateKey: this.props.userPrivateKey,
      fileList: [],
      extensions: []
    }


  }
   async componentDidMount() {
    let that = this;
    console.log(this.state.privateKey, "pass")
    console.log(this.props.currentUser, "checking dataa")

     await firebase.firestore().collection('userData').doc(this.state.uid).onSnapshot(function (snapshot) {
      if (snapshot.exists) {

      //  that.state.fileList = snapshot.data().files;
       
        that.setState({fileList: snapshot.data().files})
         
        console.log(that.state.fileList)
        that.props.getFileNames(that.state.fileList)
        fileLength = snapshot.data().files.length;
        console.log(fileLength)

      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    });
  //  }
    for (var i = 0; i < fileLength; i++) {

      console.log(that.state.fileList[i])
      // let fileList = that.state.fileList

      // let extension = fileList[i].slice((fileList[i].lastIndexOf(".") - 1 >>> 0) + 2);
      // this.setState({extensions: extension })
      // console.log(this.state.extensions, "file extensions")



    }

    console.log(this.state.extensions);
     
  
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


  onSaveData(event) {
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
      this.uploadFile();
    }
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
    // let hash = fileData.fileHash
    // firebase.firestore().collection('userData').doc(uid).field
    

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
    var storageRef = firebase.storage().ref(uid)
    var uploadTask = await storageRef.child(this.state.HashStateMessage).put(file).then((snapshot) => {
      console.log('Uploaded a Blob or File');
      that.setState({ currentStatus: "File Uploaded" })
      firebase.firestore().collection('userData').doc(this.state.uid).update({
        files: firebase.firestore.FieldValue.arrayUnion(fileName)
  
      })
      // that.setState({fileList : fileName});
    }).catch(errr => {
      console.log("data storage error " + errr)
    })
  };

  handleLabelClick(filename){
    
    console.log(filename)
    let file_Hash = sha256(utf8.encode(filename));
    console.log(file_Hash)
    this.props.getFileHash(file_Hash);
    this.props.isFileSelected(true);
    // <Download/>
  }

  render() {
    const {
      encryptionKey,
    } = this.state;

    return (
      <div>

        <form className='add-product' onSubmit={this.onSaveData.bind(this)}>
          <div className='form-group'>
            <input
              type='file'
              ref='myFile'
              multiple="multiple"
              // onChange={(e) => this.onFileChange(e)}
              onChange={this.captureFile}
              className='form-control' />

          </div>

          <Button

            color="primary"
            type="submit" name="action"
            title='submit'

          >
            Upload
        </Button>
          <br />
          <label style={{ fontSize: '20px', color: 'blue' }}>{this.state.currentStatus}</label>
          <br />

        </form>

        <br />
       
        <Container>
        <Row className = "card-spacing">
          
             
 {     
  this.state.fileList.map((file ) => {
          return (
               <Col className = "card-spacing" lg={2} md={2} >
               <div>
                 <Card className = "card-background">
                 <CardBody>
                   <FileIcon color = "lightblue" className = "card-icon"  size={50} />
                   <CardText className="file-name" onClick ={() => this.handleLabelClick(file)}>{file}</CardText>
                   
                   {/* <CardTitle >{file}</CardTitle> */}
                 </CardBody>
                 </Card>
               </div>
           </Col>
       )

    })
  } 
  </Row>
  </Container>
 <Download/>
  
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
    notification: state.root.notify
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
    isFileSelected: (selection) => {
      dispatch(isFileSelected(selection));
    }
    
  })
}
export default connect(mapStateToProp, mapDispatchToProp)(UploadFiles);
