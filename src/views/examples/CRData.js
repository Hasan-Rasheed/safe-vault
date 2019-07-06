import React from 'react';
import {Input,Button, } from 'reactstrap';
import CryptoJS from 'crypto-js';
// import axios from 'axios'
import { connect } from 'react-redux';
import firebase from 'firebase';
import {getAddress} from '../../store/actions/actions';

const axios = require('axios');


var encrypted = ''
class CreateReadData extends React.Component {




  state={
    privateKey:'',
    Keyindex:'',
    data:'',
    currentStatus: '',
    decryptedData: '',
  }


  componentDidMount(){
  
  let that=this;
    firebase.firestore().collection("userData").doc(this.props.userId).get().then(function(doc) {
      if (doc.exists) {
          console.log("Document data:", doc.data());
          console.log(doc.data().address)
          that.props.userAddress(doc.data().address)
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
  }).catch(function(error) {
      console.log("Error getting document:", error);
  });


  }

  OnChangePrivateKey = (event) => {
    
    this.setState({privateKey:event.target.value })
}
OnChangeKey = (event) => {
    
  this.setState({Keyindex:event.target.value })
}
OnChangeData = (event) => {
    
  this.setState({data:event.target.value })
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
  this.setState({ currentStatus: "Encrypting and uploading file. Please wait.." })
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
  
  axios.post('http://192.168.137.212:3003/sendData', obj)
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
  
};

onReadData(event) {
  event.preventDefault();

  console.log(this.state.privateKey, "password")
  if (this.state.privateKey === '') {
    alert("Enter you Private Key");
    return
  }
  else {
    this.decryptData();
  }
}
  
decryptData = (event) => {

  var decrypted = CryptoJS.AES.decrypt(encrypted, this.state.privateKey).toString(CryptoJS.enc.Latin1);
  this.setState({decryptedData: decrypted})
  console.log(decrypted, "decrypted data")
}

  render() {
    return (
      <div>
      <form className='add-product button-alignment' onSubmit={this.onSaveData.bind(this)}>
      <div className = "form-styling ">
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
          onChange={this.OnChangeData.bind(this)}
          />
          <br/>
          <Button

            color="primary"
            type="submit" name="action"
            title='submit'
            // onClick = {this.onSave}

          >
            Save
        </Button>
        <hr/>
        </div>
</form>

        <form className='add-product button-alignment' onSubmit={this.onReadData.bind(this)}>
        <div className = "form-styling ">

        <h1>Data Read</h1>
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
          onChange = {this.OnChangeKey}
          placeholder = 'Index'
          />
          <br/>
          <Input type="textarea" name="text" id="exampleText" value = {this.state.decryptedData}/>
            
          <br/>
          <Button

            color="primary"
            type="submit" name="action"
            title='submit'

          >
            Retreive
        </Button>
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
    userId:state.root.userID
  })
}
function mapDispatchToProp(dispatch) {
  return ({
    userAddress: (address) => {
      dispatch(getAddress(address));
    }
  })
}
export default connect(mapStateToProp, mapDispatchToProp)(CreateReadData);
// export default  CreateReadData;