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
import { getCurrentUserId, errorMessage } from "../../store/actions/actions";



var keySize = 256;
var ivSize = 128;
var iterations = 100;

class DownloadFile extends Component {

    constructor(props) {
        super(props);
        // super(props)
        this.state = {
            // file : "",
            fileData: "",
            encryptedFile: "",
            encryptionKey: "",
            fileHash: "",
            privateKey: "",
            fileUrl: "",

            // image : null 
        }

        this.onDownloadFile = this.onDownloadFile.bind(this);
        this.onPrivateKeyChange = this.onPrivateKeyChange.bind(this);
        this.decrypt = this.decrypt.bind(this);
        this.onButtonClick = this.onButtonClick.bind(this);
    }
    onPrivateKeyChange(e) {
        let key = e.target.value;

        console.log(key);
        this.setState({ privateKey: key });
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
    // async getData() {
    //     const accounts = await web3.eth.getAccounts();
    //     await StorageController.methods
    //         .data(accounts[0]).call().then(Hash => {
    //             fileHash = Hash;
    //         });
    // }

    // async onReadData(event) {
    //     event.preventDefault();

    //     await this.getData();
    //     this.setState({currentStatus: "Reading data.."})
    // }

    async onButtonClick(event) {
        // await this.onReadData(event);
        this.onDownloadFile(event);
    }
    async onDownloadFile() {
        // event.preventDefault();
        if (this.state.privateKey === '') {
            alert("Incorrect Private key")
            return
        }


        let uid = this.props.currentUser;
        console.log(uid)
        let hash = "9969bf81092003764d521fb7455d68c6633765713251ae3bc21092af9f254469";
        var storageRef = firebase.storage().ref(uid);
        await storageRef.child(hash).getDownloadURL().then(url => {
            this.setState({ fileUrl: url })
            console.log(this.state.fileUrl, "url is here")
            //     // dispatch({ type: "FILE_URL", payload: url })
            //     // dispatch({ type: "FILE_Name", payload: name })

        }).catch(err => {
            console.log(err, "url error")
        })
        console.log(this.state.fileUrl, "url outside")
        var link = document.createElement("a");
        link.href = this.state.fileUrl;
        console.log(link.href, "link address")
        document.body.appendChild(link);

        var request = new XMLHttpRequest();
        request.open('GET', link.href, true);
        request.responseType = 'blob';
        request.onload = () => {
            var eReader = new FileReader();
            eReader.readAsText(request.response);
            eReader.onload = (e) => {
                //   this.setState({currentStatus: "Decrypting file. Please wait.."})
                console.log(this.state.privateKey);
                console.log(e.target.result)
                // console.log(typeof CryptoJS.AES.decrypt(e.target.result, this.state.privateKey).toString(CryptoJS.enc.Latin1))
                // var decrypted =   CryptoJS.AES.decrypt(e.target.result, this.state.privateKey).toString(CryptoJS.enc.Latin1);
                console.log(this.decrypt(e.target.result, this.state.privateKey));
                var decrypted = this.decrypt(e.target.result, this.state.privateKey);
                // console.log(decrypted, "msgsssssssssssssss")
                var a = document.createElement("a");
                a.href = decrypted;


                if (decrypted.toString().includes("data")) {
                    alert("Error in decryption. Most likely caused by the wrong private key.")
                    return;
                }

                
                // let split1 = decrypted.toString().split("data:")
                // let split2 = split1[1].split(";base64")
                // let type = split2[0]

                a.download = hash;
                document.body.appendChild(a);
                a.click();
                console.log("file")
                //   this.setState({currentStatus: "File downloaded."})
            };
        };
        request.send();
    }



    render() {
        const {
            encryptionKey,
        } = this.state;


        const {
            encrypt,
            decrypt,
        } = this.context;

        return (
            <div>
                <h1>Here you can download your file  </h1>
                <label value="your file name"></label>
                <input
                    type='text'
                    placeholder='enter you private key here to decrypt'
                    onChange={(e) => this.onPrivateKeyChange(e)}
                    className='form-control' />

                <Button color="primary" onClick={(e) => this.onButtonClick()}>

                    Download

                </Button>

            </div>
        );



    }
}

function mapStateToProp(state) {
    console.log(state)
    return ({
        // progressBarDisplay: state.root.progressBarDisplay,
        errorMsg: state.root.errorMessage,
        currentUser: state.root.userID
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
    })
}
export default connect(mapStateToProp, mapDispatchToProp)(DownloadFile);