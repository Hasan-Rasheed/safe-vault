import React, { Component } from "react";
// import firebase  from 'firebase';
import * as firebase from 'firebase/app';
// import 'firebase/storage';
import 'firebase/storage';
// import { Button } from "reactstrap";
import CryptoJS from 'crypto-js';
import sha256 from 'sha256';
// import {} from '../../store/actions/actions';
import { connect } from 'react-redux';
// import { getCurrentUserId, errorMessage } from "../../store/actions/actions";
import { getCurrentUserId, errorMessage, getFileNames ,getFileHash ,getUserPrivateKey, isFileSelected, getAddress } from "../../store/actions/actions";
// import {api_url} from '../../config/api'
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
    Row,
    Col
} from "reactstrap";
import { isLabeledStatement } from "typescript";
import { api_url } from "../../config/api";

const axios = require('axios');
// Decryption parameters
var keySize = 256;
var iterations = 100;
var fileHash = ''

class DownloadFile extends Component {


    constructor(props) {
        super(props);
        this.state = {
            value: '',
            currentStatus: '',
            fileUrl: "",
            fHash: '',
            uid: this.props.currentUser,
            fileList: [],
            // fileList: this.props.fileNames,
            privateKey: '',
            isButtonDisabled: this.props.file_selected,
            checkExist:false

        }
        this.OnChangePrivateKey = this.OnChangePrivateKey.bind(this);
    }

    // async componentDidMount() {
    //     let that = this;
    //     // console.log(this.state.privateKey, "pass")
       
      
         
      
    //   }

    OnChangePrivateKey = (event) => {
    
        this.setState({privateKey:event.target.value })
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
        let that=this;
        fileHash = this.props.file_hash;
        let obj={
            address:this.props.Address,
            data:fileHash
        }
        console.log(obj)
    axios.post(api_url+'/existHash', obj)
    .then(function (response) {
      console.log(response);
      that.setState({ checkExist: response.data.data })
    })
    .catch(function (error) {
      console.log(error);
    });

    }

    async onReadData(event) {
        event.preventDefault();
        
        await this.getData();
        this.setState({ currentStatus: "Reading data.." })




    }

    async onButtonClick(event) {
        await this.onReadData(event);
        if(this.state.checkExist){

               this.onDownloadFile(event);
        }
    }


    async onDownloadFile(event) {

        event.preventDefault();

        let uid = this.props.currentUser;
        var storageRef = firebase.storage().ref(uid)
        await storageRef.child(fileHash).getDownloadURL().then(url => {
            this.setState({ fileUrl: url })
        }).catch(err => {
            console.log(err, "url error")
        })

        this.setState({ currentStatus: "Downloading file. Please wait.." })
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
                var decrypted = CryptoJS.AES.decrypt(e.target.result, this.state.privateKey).toString(CryptoJS.enc.Latin1);
                var a = document.createElement("a");
                a.href = decrypted;

                if (!decrypted.toString().includes("data")) {

                    alert("Make sure Your Private Key is valid and your CORS is enabled")
                    return;
                }

                let split1 = decrypted.toString().split("data:")
                let split2 = split1[1].split(";base64")
                let type = split2[0]

                a.download = fileHash;
                document.body.appendChild(a);
                a.click();

                this.setState({ currentStatus: "File downloaded." })
            };
        };
        request.send();
    }

    render() {
        return (
            <div>


                <br />
                {
                    // (this.props.diabled) ? () : ()
                }
                
                <Input 
                type = 'password'
                className = 'form-control'
                onChange = {this.OnChangePrivateKey}
                placeholder = 'Enter Your Private Key to Encrypt the Data'
                />
              
                <br />
                <button onClick={this.onButtonClick.bind(this)}
                                  className = "button-styling"

                    ><span className ="button-span">
                        Download File
                        </span>
                        </button>
                                            <label style={{color: 'blue' }}>{this.state.currentStatus}</label>


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
    
    getFileNames: (filenames) => {
      dispatch(getFileNames(filenames));
    }
    })
}
export default connect(mapStateToProp, mapDispatchToProp)(DownloadFile);