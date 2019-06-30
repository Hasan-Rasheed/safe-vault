import React, {Component} from 'react';
import { Route, Switch } from "react-router-dom";
import routes from "routes.js";

import Sidebar from "components/Sidebar/Sidebar";
import UploadFiles from './UploadFiles'
import AdminNavbar from "components/Navbars/AdminNavbar";

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

class Company extends Component {

    componentWillMount() {
        // this.props.history.push('/admin/index');
        document.title = "Safe Vault"
    }

    readBtnHandler() {
        this.props.history.push('/');
    }

    writeBtnHandler() {
        this.props.history.push('/admin/index');
    }

    render() {
        return (
            <>
            <Sidebar
          {...this.props}
          routes={routes}
          logo={{
            innerLink: "/admin/index",
            // imgSrc: require("assets/img/brand/argon-react.png"),
            imgAlt: "..."
          }}
        />
        <div className="main-content" ref="mainContent">
          <AdminNavbar/>
          {/* <UploadFiles/> */}

          <Switch>{this.getRoutes(routes)}</Switch>
          {/* <Container fluid> */}
          <UploadFiles/>
         
        </div>
            
            <Row s={12}>
                <Col s={4}></Col>
                <Col s={4}>
                    <Row>
                        <Col s={6}>
                            <Button onClick={this.readBtnHandler.bind(this)}
                                    style={{width: '200px', backgroundColor: '#89129E'}}>Read</Button>
                        </Col>
                        <Col s={6}>
                            <Button onClick={this.writeBtnHandler.bind(this)}
                                    style={{width: '200px', backgroundColor: '#89129E'}}>Write</Button>
                        </Col>
                    </Row>
                </Col>
                <Col s={4}></Col>
            </Row>
            </>
        )
    }
}

export default (Company);
