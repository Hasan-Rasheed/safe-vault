import React, { Component } from "react";
import * as firebase from 'firebase/app';
import 'firebase/storage';
import CryptoJS from 'crypto-js';
import sha256 from 'sha256';
import { connect } from 'react-redux';
import { getCurrentUserId, errorMessage, getFileNames, getFileHash,isPaymentDone, getUserPrivateKey, isFileSelected, getAddress } from "../../store/actions/actions";
import CreditCard from './CreditCardTransaction'
import { Container, Row, Col } from 'react-grid-system';
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
      privateKey: '',
      fileList: [],
      extensions: [],
      active: null,
      Keyindex: '',
      data: '',
      flag: false,
      payment: this.props.payment,
      currentWriteStatus:'',
      loading: '',
      loadingWrite:''

    }

    this.OnChangePrivateKey = this.OnChangePrivateKey.bind(this);


  }

  componentWillMount() {
    // this.loading = this.loading.bind(this);
    this.setState({ loading: false })

  }
  componentWillReceiveProps(nextprops){
    console.log(nextprops)
    console.log(nextprops.payment)
    // console.log("i am at CWRP")
    this.transactionSuccessful(nextprops.payment)
  }

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };


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


   onUploadData(trans) {
    let that = this;
    // event.preventDefault();
    console.log(this.state.privateKey, "password")
    console.log(trans,"payment props")
    if (fileHash === '' ) {
      alert("Please select file to upload")
      return
    }
    // console.log(this.state.privateKey, "password")
    else if(this.state.privateKey === '') {
      alert("All the fields are required");
      return
    }
    else if( trans){
       this.uploadFile()
    }
      
  }
  

  OnChangePrivateKey = (event) => {

    this.setState({ privateKey: event.target.value })
    // this.props.userPrivateKey(event.target.value);
  }

  uploadFile = async () => {
    this.setState({ currentStatus: "Encrypting and uploading file. Please wait.." })
    this.setState({ loading: true });

    console.log(fileContent);
    var encrypted = CryptoJS.AES.encrypt(fileContent, this.state.privateKey)

    var eFile = new File([encrypted.toString()], "file.encrypted", { type: "text/plain" })
    let eReader = new FileReader()
    eReader.readAsArrayBuffer(eFile)
    eReader.onloadend = (e) => {
      this.convertToBuffer(eReader)
    }

    console.log(fileName, "setting file name")

    console.log(fileHash, "on upload file");

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
    // fileHash = JSON.stringify(fileHash);
    // alert("Do you want to continue")
    let obj = {
      address: this.props.Address,
      data: fileHash
    }

    console.log(obj)

    // let that = this;
    await axios.post(api_url + '/sendHash', obj)
    
      .then(response => {
        alert("Your Transaction has been done ");
        
        var storageRef = firebase.storage().ref(uid)
        storageRef.child(this.state.HashStateMessage).put(file).then((snapshot) => {
          console.log('Uploaded a Blob or File');
          that.setState({ currentStatus: "File Uploaded" })
          that.setState({ loading: false });
          this.props.isPaymentDone(false)

          firebase.firestore().collection('userData').doc(this.state.uid).update({
            files: firebase.firestore.FieldValue.arrayUnion(fileName)

          })
          // that.setState({fileList : fileName});
        }).catch(errr => {
          alert("Something went wrong with the firebase please try again")

          that.setState({privateKey:""})
          console.log("data storage error " + errr)
        })
        
      })
      .catch(error => {
        that.setState({ currentStatus: "Waiting for the Response of Transaction" })
        that.setState({ loading: true });
        alert("Your Transaction has been cancelled");
        that.setState({ currentStatus: "" })
        this.setState({ loading: false });
        this.props.isPaymentDone(false)
        

        // console.log(error);
      });
  };


  OnChangeData = (event) => {

    this.setState({ data: event.target.value })
  }

  OnChangeKey = (event) => {

    this.setState({ Keyindex: event.target.value })
  }


  onSaveData(event) {
    let that = this
    event.preventDefault();

    console.log(this.state.privateKey, "password")
    if (this.state.privateKey === '') {
      alert("Enter you Private Key");
      return
    }
    else if (this.state.Keyindex === '') {
      alert("Enter you Index Key");
      return
    }
    else if(this.state.data===''){
        alert("Please Enter you Text")
        return
      }
    else if( that.state.payment==true){
        this.encryptData();
      }
      
    }
  

  encryptData = () => {
    this.setState({ currentWriteStatus: "Encrypting..." })
    this.setState({ loadingWrite: true });

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

    axios.post(api_url + '/sendData', obj)
      .then(function (response) {
        that.setState({ currentWriteStatus: "Your Data has been saved" })
        that.setState({ loadingWrite: false });

        console.log(response);
      })
      .catch(function (error) {
        that.setState({ currentWriteStatus: "Something went wrong please try again" })
        that.setState({ loadingWrite: false });

        console.log(error);
      });

  }

  transactionSuccessful(trans){
    console.log("hello i am here")
    this.onUploadData(trans)
    // this.onSaveData()
  }



  render() {
    const {
      encryptionKey,
    } = this.state;

    return (

      <div className="form-styling ">


        <Container>
          <Row>

            <Col lg={6} md={6} xsm={6} className="form-style">
              <div className='add-product button-alignment' >
                <div className='form-group'>
                  <h1 className="heading" >Upload Files</h1>
                  <Input
                    type='file'
                    ref='myFile'
                    multiple="multiple"
                    // onChange={(e) => this.onFileChange(e)}
                    onChange={this.captureFile}
                    className='form-control' />

                  <br />

                  <Input
                    type='password'
                    className='form-control'
                    onChange={this.OnChangePrivateKey}
                    placeholder='Enter Your Private Key to Encrypt the Data'
                  />
                </div>

                <CreditCard />
                <br />
                <label style={{ fontSize: '20px', color: 'blue' }}>{this.state.currentStatus}{this.state.loading && <img src={loader} style={{ height: "2em" }} />}</label>
                {/* <span>{this.state.loading && <img src={loader} style={{ height: "3em" }} />}</span> */}

                <br />

              </div>
            </Col>
            {/* <br /> */}
            <Col lg={6} md={6} sm={6} className="form-style">
              <div className='add-product button-alignment'>
                <div className="form-group ">
                  <h1 className="heading">Write Data</h1>
                  <input
                    type='password'
                    className='form-control'
                    onChange={this.OnChangePrivateKey.bind(this)}
                    placeholder='Enter Your Private Key to Encrypt the Data'
                  />
                  <br />
                  <input
                    type='text'
                    className='form-control'
                    onChange={this.OnChangeKey.bind(this)}
                    placeholder='Index'
                  />
                  <br />
                  <Input type="textarea" name="text" id="exampleText"
                    placeholder='Your Text'
                    onChange={this.OnChangeData.bind(this)}
                  />
                  <br />
                  {/* <button
                    className="button-styling"
                    // color="primary"
                    type="submit" name="action"
                    title='submit'
                  // onClick = {this.onSave}

                  >
                    {/* <CreditCard/> 
                    <span className="button-span"> Save</span>
                  </button> */}
                                  <CreditCard />

                  <br />
                <span style={{ fontSize: '20px', color: 'blue' }}>{this.state.currentWriteStatus}{this.state.loadingWrite && <img src={loader} style={{ height: "2em" }} />}</span>
                {/* <span>{this.state.loadingWrite && <img src={loader} style={{ height: "3em" }} />}</span> */}

                  {/* <hr/> */}
                </div>
              </div>

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
    userPrivateKey: state.root.userprivatekey,
    notification: state.root.notify,
    Address: state.root.address,
    payment: state.root.payment
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
    }

  })
}
export default connect(mapStateToProp, mapDispatchToProp)(UploadFiles);
