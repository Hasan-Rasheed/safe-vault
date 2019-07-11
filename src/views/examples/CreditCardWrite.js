import React, { Fragment , Component } from "react";
import StripeCheckout from "react-stripe-checkout";
import axios from "axios";
import { connect } from 'react-redux';

import { isWritePaymentDone } from "../../store/actions/actions";
const publishableKey = "pk_test_8GPIcMBIkcVkxqEqUt1FM2To00D1yBpeYc";

class stripeBtn extends Component {
    // let that=this;
    constructor(props) {
        super(props);
    }
onToken = token => {
        const body = {
            amount: 999,
            token: token,
            
        };
        
        console.log(body)
        axios.post("http://35.229.110.230:8000/", body)
            .then(response => {
                console.log(response,"response");

                alert("Payment Success");
                this.props.isWritePaymentDone(true)
            
            })
            .catch(error => {
               this.props.isWritePaymentDone(false)

                console.log("Payment Error: ", error);
                alert("Payment Error");

            });
    };
    render(){
    return (
        
        <StripeCheckout
            label="Upload" //Component button text
            name="Business LLC" //Modal Header
            description="Upgrade to a premium account today."
            panelLabel="Pay" //Submit button in modal
            amount={999} //Amount in cents $9.99
            token={this.onToken}
            stripeKey={publishableKey}
            // image="https://www.vidhub.co" //Pop-in header image
            billingAddress={false}
        />
        
    );
};
}
function mapStateToProp(state) {
    console.log(state)
    return ({
      // progressBarDisplay: state.root.progressBarDisplay,
    //   errorMsg: state.root.errorMessage,
    //   currentUser: state.root.userID,
    //   userPrivateKey: state.root.userprivatekey,
    //   notification: state.root.notify,
    //   Address: state.root.address,
    //   payment: state.root.payment
    })
  }
function mapDispatchToProp(dispatch) {

    return ({

        isWritePaymentDone: (transaction) => {
        dispatch(isWritePaymentDone(transaction));
      }
  
    })
  }
export default connect(mapStateToProp, mapDispatchToProp)(stripeBtn);
