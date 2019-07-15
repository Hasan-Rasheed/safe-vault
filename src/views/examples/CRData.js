import React from 'react';
import {api_url} from '../../config/api'
import {Input,
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
  // Row,
  // Col,
  // Container

} from 'reactstrap';
import CryptoJS from 'crypto-js';
// import CryptoJS from 'crypto-js';
import sha256 from 'sha256';
import Download from './Download';
import FileIcon, { defaultStyles } from 'react-file-icon';
import { Container, Row, Col } from 'react-grid-system';
import '../../assets/css/style.css';
import { getCurrentUserId, errorMessage, getFileNames ,getFileHash ,getUserPrivateKey, isFileSelected, getAddress } from "../../store/actions/actions";

// import axios from 'axios'
import { connect } from 'react-redux';
import firebase from 'firebase';
// import {getAddress} from '../../store/actions/actions';
const utf8 = require('utf8');

const axios = require('axios');


var fileLength = 0;
class CreateReadData extends React.Component {




  state={
    privateKey:'',
    Keyindex:'',
    data:'',
    decryptedData: '',

    uid: this.props.currentUser,

    currentStatus: '',
    fileList:[]
  }


  
  OnChangePrivateKey = (event) => {
    
    this.setState({privateKey:event.target.value })
}

OnChangeKey=(event)=>{
  console.log(event.target.value)
  this.setState({Keyindex:event.target.value })
}



onReadData(event) {
  event.preventDefault();
let that=this;
  console.log(this.state.privateKey, "password")
  if (this.state.privateKey === '') {
    alert("Enter you Private Key");
    return
  }
  else if (this.state.Keyindex === '') {
    alert("Enter you Index Key");
    return
  }
  else {
    let obj={
      address:this.props.Address,
      index:this.state.Keyindex
    }
    this.setState({ currentStatus: "Waiting for the Response " })

    console.log(obj)
    axios.post(api_url+'/existFile', obj)
    .then(function (response) {
      console.log(response.data.data);
      that.decryptData(response.data.data);
    })
    .catch(function (error) {
      console.log(error);
    });
    // [post]
  }
}
  
decryptData = (encryptedData) => {
  this.setState({ currentStatus: "Decrypting Data " })

  var decrypted = CryptoJS.AES.decrypt(encryptedData, this.state.privateKey).toString(CryptoJS.enc.Latin1);
  this.setState({decryptedData: decrypted})
  console.log(decrypted, "decrypted data")
  this.setState({ currentStatus: "" })

}



  render() {
    return (
      <div className = "form-styling">

        <div className = "add-product button-alignment">
 <Download/>
  </div>
     
  <br/>
        <form className='add-product button-alignment' onSubmit={this.onReadData.bind(this)}>
        <div >

        <h1 className="heading">Read Data</h1>
        <input 
          type = 'password'
          className = 'form-control'
          onChange = {this.OnChangePrivateKey}
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
          <Input type="textarea" name="text" id="exampleText" value = {this.state.decryptedData} disabled/>
            
          <br/>
          <button
              className = "button-styling"

            // color="primary"
            type="submit" name="action"
            title='submit'

          >
          <span className = "button-span">  Retreive</span>
        </button>
        <br/>
        <label style={{color: 'blue' }}>{this.state.currentStatus}</label>

      </div>
      </form>
</div>
    );
  }
}
function mapStateToProp(state) {
  console.log(state)
  return ({
    Address: state.root.address,
    currentUser:state.root.userID
  })
}
function mapDispatchToProp(dispatch) {
  return ({
    userAddress: (address) => {
      dispatch(getAddress(address));
    },
    
    getFileNames: (filenames) => {
      dispatch(getFileNames(filenames));
    },
    getFileHash: (file_hash) => {
      dispatch(getFileHash(file_hash));
    },
    isFileSelected: (selection) => {
      dispatch(isFileSelected(selection));
    },
  })
}
export default connect(mapStateToProp, mapDispatchToProp)(CreateReadData);
// export default  CreateReadData;