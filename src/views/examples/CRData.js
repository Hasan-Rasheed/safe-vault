import React from 'react';
import {Input,Button, } from 'reactstrap';

export default class CreateReadData extends React.Component {

  state={
    privateKey:'',
    Keyindex:'',
    data:''
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
  
  render() {
    return (

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
          placeholder = 'ye wo btaega abhi chordo aise hi'
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

          >
            Send
        </Button>
        <hr/>





        <h1>Data Read</h1>
        <input 
          type = 'password'
          className = 'form-control'
        //   onChange = {this.OnChangePrivateKey}
          placeholder = 'Enter Your Private Key to Encrypt the Data'
          />
          <br/>
          <input 
          type = 'text'
          className = 'form-control'
        //   onChange = {this.OnChangePrivateKey}
          placeholder = 'Index'
          />
          <br/>
          <Input type="textarea" name="text" id="exampleText" />
          <br/>
          <Button

            color="primary"
            type="submit" name="action"
            title='submit'

          >
            Retreive
        </Button>
      </div>

    );
  }
}