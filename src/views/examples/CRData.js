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
    uid: this.props.currentUser,

    currentStatus: '',
    decryptedData: '',
    fileList:[]
  }


  async componentDidMount(){
  
  let that=this;
    firebase.firestore().collection("userData").doc(this.state.uid).get().then(function(doc) {
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

handleLabelClick(filename){

  if (this.state.active === filename) {
    this.setState({active : null})
  } else {
    this.setState({active : filename})
  }
  
  console.log(filename)
  let file_Hash = sha256(utf8.encode(filename));
  console.log(file_Hash)
  this.props.getFileHash(file_Hash);
  this.props.isFileSelected(true);
  // this.setState({bgColor: "blue"})
  
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
   <FileIcon style={{ align :'center'}} color = "#e4ebee" extension = {extension} {...defaultStyles[extension]} className = "card-icon"  size={50} /> 
  )
}

  render() {
    return (
      <div className = "form-styling">

<Container>
        <Row className = "card-spacing">
          
             
 {     
  this.state.fileList.map((file ) => {
          return (
          //  console.log(file)
               <Col className = "card-spacing" lg={2} md={2} xsm = {2} >
               <div>
                 <Card className = "card-background" style={ { backgroundColor: this.myColor(file), fontweight:'bold'}} onClick ={() => this.handleLabelClick(file)}>
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