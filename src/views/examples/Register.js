import React , {Component} from 'react';
import firebase from 'firebase'
import {signupAction, errorMessage} from '../../store/actions/actions';
import { connect } from 'react-redux';
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
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col
} from "reactstrap";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
        userName: '',
        email: '',
        password: '',
        // uid:''
    }
    this.signup = this.signup.bind(this)
    this._onChangeEmail = this._onChangeEmail.bind(this)
    this._onChangeUserName = this._onChangeUserName.bind(this)
    this._onChangePassword = this._onChangePassword.bind(this)
    // this._onChangeEmail = this._onChangeEmail.bind(this);
    // this._onChangePassword = this._onChangePassword.bind(this);
}

//   signup(user) { 
//     return firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
//   .then((createdUser) => {
//       console.log('signed up successfully', createdUser.uid);
//       delete user.password;
//       user.uid = createdUser.uid;
//       // firebase.database().ref('users/' + createdUser.uid + '/').set(user)
//       //     .then(() => {
//       //         // dispatch({ type: 'CURRENT_USER_UID', payload: createdUser.uid })
//       //         // dispatch({ type: "IS_LOGIN", payload: true })
//       //         // history.push('/home');
//       //         console.log('successful');
//       //     })
//   })
//   .catch((err) => {
//       // dispatch({ type: "SHOW_PROGRESS_BAR", payload: false })
//       // dispatch({ type: "ERROR_MESSAGE", payload: err.message })
//       // console.log(err)
//       console.log('error');
//   })
// }
signup(event) {
  // event.preventDefault();
  if((this.state.userName === '' || this.state.email === '' || this.state.password === ''))
  {
      this.props.errorMessage('All the fields are required!');
  }
  else{
      let user = {
          email: this.state.email,
          userName: this.state.userName,
          // lastName : this.state.lastName,
          password: this.state.password,
          uid: ''
      }
      // this.props.signupwithEmailPassword(user);
      // console.log(user);
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
  .then((createdUser) => {
    console.log(createdUser)
      console.log('signed up successfully', createdUser.user.uid);
      delete user.password;
      this.props.history.push('/admin/index');

      
      // console.log(createdUser.uid);
      user.uid = createdUser.user.uid;
      // console.log(user.uid);
      firebase.database().ref('userData/' + user.uid + '/').set(user)
          .then(() => {
              console.log("USER ADDED TO FIREBASE")
  })
  .catch((err) => {
          // dispatch({ type: "SHOW_PROGRESS_BAR", payload: false })
          // dispatch({ type: "ERROR_MESSAGE", payload: err.message })
          // console.log(err)
          console.log('error',err.message);
})
})
.catch((err) => {
  // dispatch({ type: "SHOW_PROGRESS_BAR", payload: false })
  // dispatch({ type: "ERROR_MESSAGE", payload: err.message })
  // console.log(err)
  console.log('error',err.message);
})
}
}
_onChangeEmail(event){
  this.props.errorMessage('');
  this.setState({
      email:event.target.value
      
  })
  // console.log(this.email);
}
_onChangeUserName(event){
  this.setState({
      userName :event.target.value
  })
}
_onChangePassword(event){
  this.setState({
      password:event.target.value
  })
}

  render() {
    return (
      <>
        <Col lg="6" md="8">
          <Card className="bg-secondary shadow border-0">
            {/* <CardHeader className="bg-transparent pb-5">
              <div className="text-muted text-center mt-2 mb-4">
                <small>Sign up with</small>
              </div>
              <div className="text-center">
                <Button
                  className="btn-neutral btn-icon mr-4"
                  color="default"
                  href="#pablo"
                  onClick={e => e.preventDefault()}
                >
                  <span className="btn-inner--icon">
                    <img
                      alt="..."
                      src={require("assets/img/icons/common/github.svg")}
                    />
                  </span>
                  <span className="btn-inner--text">Github</span>
                </Button>
                <Button
                  className="btn-neutral btn-icon"
                  color="default"
                  href="#pablo"
                  onClick={e => e.preventDefault()}
                >
                  <span className="btn-inner--icon">
                    <img
                      alt="..."
                      src={require("assets/img/icons/common/google.svg")}
                    />
                  </span>
                  <span className="btn-inner--text">Google</span>
                </Button>
              </div>
            </CardHeader> */}
            <CardBody className="px-lg-5 py-lg-5">
              <div className="text-center text-muted mb-4">
                <h1>Create Account</h1>
              </div>
              <Form role="form">
                <FormGroup>
                  <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-hat-3" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input placeholder="Name" name = "userName" type="text" value={this.state.userName} onChange={this._onChangeUserName}/>
                  </InputGroup>
                </FormGroup>
                {/* <FormGroup>
                  <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-email-83" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input placeholder="Email" name = "email" type="email" value={this.state.email} onChange={this._onChangeEmail}/>
                  </InputGroup>
                </FormGroup> */}
                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-lock-circle-open" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input placeholder="Password" name = "password" type="password" value={this.state.password} onChange={this._onChangePassword}/>
                  </InputGroup>
                </FormGroup>
                {/* <div className="text-muted font-italic">
                  <small>
                    password strength:{" "}
                    <span className="text-success font-weight-700">strong</span>
                  </small>
                </div> */}
                <Row className="my-4">
                  <Col xs="12">
                    <div className="custom-control custom-control-alternative custom-checkbox">
                      <input
                        className="custom-control-input"
                        id="customCheckRegister"
                        type="checkbox"
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="customCheckRegister"
                      >
                        <span className="text-muted">
                          I agree with the{" "}
                          <a href="#pablo" onClick={e => e.preventDefault()}>
                            Privacy Policy
                          </a>
                        </span>
                      </label>
                    </div>
                  </Col>
                </Row>
                <div className="text-center">
                  <Button className="mt-4" color="primary" type="button" onClick = {this.signup}>
                    Create account
                  </Button>
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
  return ({
      // progressBarDisplay : state.root.progressBarDisplay,
      errorMsg : state.root.errorMessage
  })
}
function mapDispatchToProp(dispatch) {
  return ({
      signupwithEmailPassword: (userDetails)=>{
          dispatch(signupAction(userDetails));
      },
      errorMessage: (message)=>{
          dispatch(errorMessage(message));
      }
  })
}
export default connect(mapStateToProp, mapDispatchToProp)(Register);
