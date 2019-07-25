import React, { Component } from 'react';
import firebase from 'firebase'
import { signupAction, errorMessage, getCurrentUserId, getUserPrivateKey, getAddress, getNotification, updateUserName } from '../../store/actions/actions';
import { connect } from 'react-redux';
import EthCrypto from 'eth-crypto';
import loader from '../../assets/img/icons/Spinner.gif';



// reactstrap components
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Col
} from "reactstrap";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      email: '',
      password: '',
      registerError: '',
      loading: ''

    }
    this.signup = this.signup.bind(this)
    this._onChangeEmail = this._onChangeEmail.bind(this)
    this._onChangeUserName = this._onChangeUserName.bind(this)
    this._onChangePassword = this._onChangePassword.bind(this)
  }

  componentWillMount() {
    // this.loading = this.loading.bind(this);
    this.setState({ loading: false })

  }
  signup(event) {
    if ((this.state.userName === '' || this.state.email === '' || this.state.password === '')) {
      this.setState({ registerError: 'All Fields are required.' })

    }
    else {
      let user = {
        email: this.state.email,
        userName: this.state.userName,
        password: this.state.password,
        uid: '',
        files: [],
        address: ''
      }
      this.setState({ loading: true });

      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then((snapshot) => {
          console.log(snapshot)
          console.log('signed up successfully', snapshot.user.uid);

          this.props.userPrivateKey(user.password)
          delete user.password;
          this.props.userLoggedinOrRegistered("Registered")
          let currentUser = snapshot.user.uid;
          console.log(currentUser);
          this.props.currentUserId(currentUser);
          // console.log(createdUser.uid);
          user.uid = currentUser;

          console.log(user.uid);
          console.log(user)
          let db = firebase.firestore()
          db.collection('userData').doc(currentUser).set(user)
            .then(() => {
              console.log("USER ADDED TO FIREBASE")
              const identity = EthCrypto.createIdentity();
              console.log(identity.address, "Address");
              db.collection('userData').doc(currentUser).update({
                address: identity.address
              })
              this.props.userAddress(identity.address);
              this.props.updateUserName(user.userName);
              this.setState({ userName: "", email: "", password: "" })
              this.setState({ loading: false });

              this.props.history.push('/admin/index');
            })

            .catch((err) => {
              this.setState({ userName: "", email: "", password: "" })

              alert("Something went wrong! Please Try again")
              console.log('error', err.message);
            })

        })
        .catch((err) => {
          this.setState({ userName: "", email: "", password: "" })

          console.log('error', err.message);
          this.setState({ registerError: 'The email address is already in use by another account.'  , loading: false})
        })
    }
  }
  _onChangeEmail(event) {
    this.props.errorMessage('');
    this.setState({
      email: event.target.value

    })

  }
  _onChangeUserName(event) {
    this.setState({
      userName: event.target.value
    })
  }
  _onChangePassword(event) {
    this.setState({
      password: event.target.value
    })
  }

  render() {
    return (
      <>
        <Col lg="6" md="8">
          <Card className="bg-secondary shadow border-0">

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
                    <Input placeholder="Name" name="userName" type="username" value={this.state.userName} onChange={this._onChangeUserName} />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-email-83" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input placeholder="Email" name="email" type="email" value={this.state.email} onChange={this._onChangeEmail} />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-lock-circle-open" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input placeholder="Password" name="password" type="password" value={this.state.password} onChange={this._onChangePassword} />
                  </InputGroup>
                </FormGroup>
                <div className="text-center">
                  <span style={{ color: "red", fontweight: 'bold', fontSize: '15px' }}>{this.state.registerError}</span>
                  {(this.state.registerError != "") ? <br /> : ""}
                  <span>{this.state.loading && <img src={loader} style={{ height: "3em" }} />}</span>
                  <br />
                  <Button className="mt-4" color="primary" type="button" onClick={this.signup}>
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
    errorMsg: state.root.errorMessage,

  })
}
function mapDispatchToProp(dispatch) {
  return ({
    signupwithEmailPassword: (userDetails) => {
      dispatch(signupAction(userDetails));
    },
    errorMessage: (message) => {
      dispatch(errorMessage(message));
    },

    currentUserId: (uid) => {
      dispatch(getCurrentUserId(uid))
    },

    userPrivateKey: (key) => {
      dispatch(getUserPrivateKey(key))
    }
    ,
    userLoggedinOrRegistered: (notify) => {
      dispatch(getNotification(notify))
    },

    updateUserName: (user) => {
      dispatch(updateUserName(user));

    },
    userAddress: (address) => {
      dispatch(getAddress(address));
    }
  })

}
export default connect(mapStateToProp, mapDispatchToProp)(Register);
