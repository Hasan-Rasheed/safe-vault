import React , {Component} from "react";
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import { signinAction, errorMessage, getCurrentUserId , getNotification , updateUserName} from '../../store/actions/actions';
import firebase from 'firebase';
import history from '../../history';

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  NavItem,
  NavLink,
  Nav,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col
} from "reactstrap";


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
        email: '',
        password: '',
        loginError: '',
    }
    this.signin = this.signin.bind(this);
    this._onChangeEmail = this._onChangeEmail.bind(this);
    this._onChangePassword = this._onChangePassword.bind(this);
}

signin(event) { 
  let that =this //Method that dispatch an action
    event.preventDefault();
    if((this.state.email === '' || this.state.password === ''))
    {
        this.props.errorMessage('Both the fields are required!');
    }
    else{
        let user = {
            email: this.state.email,
            password: this.state.password
        }
        console.log(user)
        firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then((snapshot)=> {
          let currentUser = snapshot.user.uid;
          console.log(snapshot.user.uid);
          this.props.currentUserId(snapshot.user.uid);
          console.log(user.password)
      
        let that = this;
return firebase.firestore().collection('userData').doc(currentUser).get().then(function(snapshot) {
 console.log(snapshot);
 if (snapshot.exists) {
  console.log("Document data:", snapshot.data().userName);
  that.props.updateUserName(snapshot.data().userName);
            that.props.history.push('/admin/index');

} else {

}
 

});
        
      })
      .catch((err) => {
        
        console.log(err.message);
        this.setState({ email:"",password:""})

        this.setState({loginError: 'Invalid Email Address or Password'})

    })
      
    }
}

_onChangeEmail(event) {  // Onchange Event Handlers
    this.setState({
        email: event.target.value
    })
}
_onChangePassword(event) {
    this.setState({
        password: event.target.value
    })
}
componentWillMount(){
    this.props.errorMessage('');
}
  render() {
    return (
      <>
        <Col lg="5" md="7">
          <Card className="bg-secondary shadow border-0">
          
            <CardBody className="px-lg-5 py-lg-5">
              <div className="text-center text-muted mb-4">
                <h1>Login</h1>
              </div>
              <Form role="form">
                <FormGroup className="mb-3">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-email-83" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input placeholder="Email" type="email" value={this.state.email} onChange={this._onChangeEmail} validate/>
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-lock-circle-open" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input placeholder="Password" type="password"  value={this.state.password} onChange={this._onChangePassword} validate/>
                  </InputGroup>
                </FormGroup>
                
                <div className="text-center">
                  <Button className="my-4" color="primary" type="button" onClick = {this.signin}>
                    Sign in
                  </Button>
                  {/* <Link to='/'>Be awesome, join our community!</Link> */}
                  <br/>
                  <span style = {{color : "red" ,fontweight: 'bold', fontSize: '15px'}}>{this.state.loginError}</span>
                </div>
              </Form>
            </CardBody>
          </Card>
         
        </Col>
      </>
    );
  }
}

function mapStateToProp(state) {
  console.log(state);
  return ({
      
      errorMsg : state.root.errorMessage,
   
      
  })
}
function mapDispatchToProp(dispatch) {
  return ({
      signinWithEmailPassword: (user) => {
          dispatch(signinAction(user));
      },
      errorMessage: (message)=>{
          dispatch(errorMessage(message));
      },
      updateUserName: (user) => {
        dispatch(updateUserName(user));

      },
      currentUserId : (uid) => {
        dispatch(getCurrentUserId(uid))
      },
     
      userLoggedinOrRegistered : (notify) => {
        dispatch(getNotification(notify))
      }
  })
}

export default connect(mapStateToProp, mapDispatchToProp)(Login);
