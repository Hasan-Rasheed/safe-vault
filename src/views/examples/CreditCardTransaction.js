import React, { Fragment, Component } from "react";
import StripeCheckout from "react-stripe-checkout";
import axios from "axios";
import { connect } from 'react-redux';

import { isPaymentDone, loadingTransaction } from "../../store/actions/actions";
const publishableKey = "pk_test_3vWexxoZqy0lfUR6JbWpkHDd00Qytb9qLu";

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
        console.log(this.props.fileChosen)
        console.log(this.props.dataWritten)
         if (this.props.userPrivateKey == "") {
            console.log("IN CREDIT CARD FILE")
            alert("please enter private key")
            return
        }
       else if (!this.props.fileChosen && !this.props.dataWritten && !this.props.indexWritten) {
            alert("CHOOSE THE FILE Or Write the Data")
            return
        }
        else if (this.props.dataWritten) {
            if (!this.props.indexWritten) {
                alert("Please Enter You Index Key")
                return
            }
        }
      

        else if (this.props.indexWritten) {
            if (!this.props.dataWritten) {
                alert("Please Enter You Data")
                return
            }
        }
        if(  (this.props.dataWritten && this.props.indexWritten)  || this.props.fileChosen){
            console.log(this.props.dataWritten, "+" ,  this.props.indexWritten, "+" ,this.props.fileChosen)
        this.props.loadingTransaction(true)
        console.log(body)
        axios.post("http://34.74.237.53:8000/", body)
            .then(response => {
                console.log(response, "response");

                alert("Payment Success");
                this.props.isPaymentDone(true)
    this.props.loadingTransaction(false)


            })
            .catch(error => {
                this.props.isPaymentDone(false)

                console.log("Payment Error: ", error);
                alert("Payment Error");
    this.props.loadingTransaction(false)

                

            });
        
        }
    };

    render() {
        return (

            <StripeCheckout
                label="SAVE" //Component button text
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
        userPrivateKey: state.root.userprivatekey,
        //   notification: state.root.notify,
        indexWritten: state.root.indexwritten,
        dataWritten: state.root.datawritten,
        fileChosen: state.root.filechosen
    })
}
function mapDispatchToProp(dispatch) {

    return ({

        isPaymentDone: (transaction) => {
            dispatch(isPaymentDone(transaction));
        },
        loadingTransaction: (loader) => {
            dispatch(loadingTransaction(loader))
        }

    })
}
export default connect(mapStateToProp, mapDispatchToProp)(stripeBtn);
