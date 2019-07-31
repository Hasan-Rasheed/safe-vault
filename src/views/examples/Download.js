import React, { Component } from "react";
// import firebase  from 'firebase';
import * as firebase from 'firebase/app';
// import 'firebase/storage';
import 'firebase/storage';
// import { Button } from "reactstrap";
import CryptoJS from 'crypto-js';
import sha256 from 'sha256';
import { Container, Row, Col } from 'react-grid-system';
import { connect } from 'react-redux';
// import { getCurrentUserId, errorMessage } from "../../store/actions/actions";
import { getCurrentUserId, errorMessage, getFileNames, getFileHash, getUserPrivateKey, isFileSelected, getAddress } from "../../store/actions/actions";
import loader from '../../assets/img/icons/Spinner.gif';

import FileIcon, { defaultStyles } from 'react-file-icon';

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
import { isLabeledStatement } from "typescript";
import { api_url } from "../../config/api";

const axios = require('axios');
const utf8 = require('utf8');

// Decryption parameters
var keySize = 256;
var iterations = 100;
var fileHash = ''
var fileLength = 0;

class DownloadFile extends Component {


  constructor(props) {
    super(props);
    this.state = {
      value: '',
      currentStatus: '',
      currentDataStatus: '',
      fileUrl: "",
      fHash: '',
      uid: this.props.currentUser,
      fileList: [],
      privateKey: '',
      isButtonDisabled: this.props.file_selected,
      checkExist: false,
      loading: '',
      privateKey: '',
      Keyindex: '',
      data: '',
      decryptedData: '',
      fileSelected: false

    }
    this.OnChangePrivateKey = this.OnChangePrivateKey.bind(this);
  }

  // async componentDidMount() {
  //     let that = this;
  //     // console.log(this.state.privateKey, "pass")




  //   }
  async componentDidMount() {

    let that = this;
    firebase.firestore().collection("userData").doc(that.state.uid).get().then(function (doc) {
      if (doc.exists) {
        console.log("Document data:", doc.data());
        console.log(doc.data().address)
        that.props.userAddress(doc.data().address)
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    }).catch(function (error) {
      console.log("Error getting document:", error);
    });

    console.log(this.props.currentUser, "checking dataa")

    await firebase.firestore().collection('userData').doc(that.state.uid).onSnapshot(function (snapshot) {
      if (snapshot.exists) {

        //  that.state.fileList = snapshot.data().files;

        that.setState({ fileList: snapshot.data().files })

        console.log(that.state.fileList)
        that.props.getFileNames(that.state.fileList)
        fileLength = snapshot.data().files.length;
        console.log(fileLength)

      } else {
        // doc.data() will be undefined in this case
        that.setState({currentStatus:"Please Select the file to download" , loading: false})
        console.log("No such document!");
      }
    });
    that.setState({ loading: false })


  }

  OnChangePrivateKey = (event) => {

    this.setState({ privateKey: event.target.value })
    // this.props.userPrivateKey(event.target.value);
  }

  decrypt(transitmessage, pass) {

    var salt = CryptoJS.enc.Hex.parse(transitmessage.substr(0, 32));
    var iv = CryptoJS.enc.Hex.parse(transitmessage.substr(32, 32))
    var encrypted = transitmessage.substring(64);

    var key = CryptoJS.PBKDF2(pass, salt, {
      keySize: keySize / 32,
      iterations: iterations
    });

    var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    })
    return decrypted;
  }

  async getData() {
    let that = this;
    fileHash = this.props.file_hash;
    let obj = {
      address: this.props.Address,
      data: fileHash
    }
    console.log(obj)
    await axios.post(api_url + '/existHash', obj)
      .then(function (response) {
        console.log(response);
        that.setState({ checkExist: response.data.data })
      })
      .catch(function (error) {
        console.log(error);
      });

  }

  async onReadData() {
    await this.getData();
    this.setState({ currentStatus: "Reading data.." })
    this.setState({ loading: true });




  }

  onButtonClick() {
    if (this.state.privateKey === '') {

      alert("Enter you Private Key");
      return
    }
    else if (this.state.fileSelected && !this.state.Keyindex == '') {

      this.onRetrieveData()
      this.fileDownload()
    }
    else if (this.state.fileSelected && this.state.Keyindex == '') {

      this.fileDownload()
    }
    else if (!this.state.fileSelected && !this.state.Keyindex == '') {

      this.onRetrieveData()
    }
    else if (!this.state.fileSelected && this.state.Keyindex == '') {

      alert("Please Select the file to download or Key index to retrieve the Data")
    }

  }

  async fileDownload(event) {

    await this.onReadData(event);
    if (this.state.checkExist) {
      console.log(this.state.checkExist, "existing")
      this.onDownloadFile(event);
    }
  }


  async onDownloadFile() {

    this.setState({ currentStatus: "Waiting for the Response from the Blockchain" })
    this.setState({ loading: true });

    let uid = this.props.currentUser;
    var storageRef = firebase.storage().ref(uid)
    await storageRef.child(fileHash).getDownloadURL().then(url => {
      this.setState({ fileUrl: url })
    }).catch(err => {
      console.log(err, "url error")
    })

    this.setState({ currentStatus: "Downloading file. Please wait.." })
    this.setState({ loading: true });

    var link = document.createElement("a");
    console.log(uid, "download uuidddddd")
    console.log(fileHash, 'filehashh')
    link.href = this.state.fileUrl
    console.log(link.href, "link")
    document.body.appendChild(link);

    var request = new XMLHttpRequest();
    request.open('GET', link.href, true);
    request.responseType = 'blob';
    request.onload = () => {
      var eReader = new FileReader();
      eReader.readAsText(request.response);
      eReader.onload = (e) => {
        this.setState({ currentStatus: "Decrypting file. Please wait.." })
        this.setState({ loading: true });

        var decrypted = CryptoJS.AES.decrypt(e.target.result, this.state.privateKey).toString(CryptoJS.enc.Latin1);
        var a = document.createElement("a");
        a.href = decrypted;

        if (!decrypted.toString().includes("data")) {

          alert("Make sure Your Private Key to Download the File is valid and your CORS is enabled")
          return;
        }

        let split1 = decrypted.toString().split("data:")
        let split2 = split1[1].split(";base64")
        let type = split2[0]

        a.download = fileHash;
        document.body.appendChild(a);
        a.click();

        this.setState({ currentStatus: "File downloaded." })
        this.setState({ loading: false });

      };
    };
    request.send();
  }

  handleLabelClick(filename) {

    if (this.state.active === filename) {
      this.setState({ active: null })
    } else {
      this.setState({ active: filename })
    }

    console.log(filename)
    let file_Hash = sha256(utf8.encode(filename));
    console.log(file_Hash)
    this.props.getFileHash(file_Hash);

    this.setState({ fileSelected: true })

    // <Download/>
  }
  // console.log(filename)
  myColor(filename) {
    if (this.state.active === filename) {
      return "#b2b2e0";
    }
    return "";
  }
  fileExtension = (file) => {
    let extension = file.slice((file.lastIndexOf(".") - 1 >>> 0) + 2);
    return (
      <FileIcon style={{ align: 'center' }} color="#e4ebee" extension={extension} {...defaultStyles[extension]} className="card-icon" size={50} />
    )
  }

  //Retrieve Functionss


  OnChangeKey = (event) => {
    console.log(event.target.value)
    this.setState({ Keyindex: event.target.value })
  }



  onRetrieveData = () => {

    let that = this;

    let obj = {
      address: this.props.Address,
      index: this.state.Keyindex
    }
    this.setState({ currentDataStatus: "Waiting for the Response " })

    console.log(obj)
    axios.post(api_url + '/existFile', obj)
      .then(function (response) {
        console.log(response.data.data);
        that.decryptData(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
    // [post]

  }

  decryptData = (encryptedData) => {
    this.setState({ currentDataStatus: "Decrypting Data " })

    var decrypted = CryptoJS.AES.decrypt(encryptedData, this.state.privateKey).toString(CryptoJS.enc.Latin1);
    this.setState({ decryptedData: decrypted })
    console.log(decrypted, "decrypted data")
    this.setState({ currentDataStatus: "" })

  }



  render() {
    return (
      <div className="form-styling">
        <div className='add-product button-alignment'>
          <div >

            <h1 className="heading">Read Data</h1>
            <input
              type='password'
              className='form-control'
              onChange={this.OnChangePrivateKey}
              placeholder='Enter Your Private Key to Decrypt the Data'
            />
            <br />
            <input
              type='text'
              className='form-control'
              onChange={this.OnChangeKey.bind(this)}
              placeholder='Index'
            />
            <br />
            <Input
              type="textarea"
              name="text"
              id="exampleText"
              value={this.state.decryptedData}
              placeholder='Your Text'
              disabled />

            <br />
            <label style={{ color: 'blue' }}>{this.state.currentDataStatus}</label>

          </div>
        </div>
        <div className="add-product button-alignment">
          <h1 className="heading">Download File</h1>

          <Container>

            <Row>

              {
                this.state.fileList.map((file) => {
                  return (
                    //  console.log(file)
                    <Col className="card-spacing" lg={2} md={2} xsm={2} >
                      <div>
                        <Card className="card-background" style={{ backgroundColor: this.myColor(file), fontweight: 'bold' }} onClick={() => this.handleLabelClick(file)}>
                          <CardBody>
                            {this.fileExtension(file)}
                            <CardText className="file-name" >{file}</CardText>


                          </CardBody>
                        </Card>
                      </div>
                    </Col>
                  )
                }
                )



              }
            </Row>
          </Container>

          <br />
          {
            // (this.props.diabled) ? () : ()
          }


          <br />
          <button onClick={this.onButtonClick.bind(this)}
            className="button-styling"

          ><span className="button-span">
              READ
                        </span>
          </button>
          <br />
          <label style={{ color: 'blue' }}>{this.state.currentStatus}{this.state.loading && <img src={loader} style={{ height: "2em" }} />}</label>

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
    // userPrivateKey: state.root.userprivatekey,
    fileNames: state.root.filenames,
    file_hash: state.root.file_hash,
    file_selected: state.root.selection,
    Address: state.root.address
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
    }
    ,
    getFileHash: (file_hash) => {
      dispatch(getFileHash(file_hash));
    },

    getFileNames: (filenames) => {
      dispatch(getFileNames(filenames));
    },
    isFileSelected: (selection) => {
      dispatch(isFileSelected(selection));
    },

    userAddress: (address) => {
      dispatch(getAddress(address));
    }
  })
}
export default connect(mapStateToProp, mapDispatchToProp)(DownloadFile);