import React from "react";
import { Route, Switch } from "react-router-dom";
// reactstrap components
import { Container } from "reactstrap";
// core components
import AdminNavbar from "components/Navbars/AdminNavbar";
import AdminFooter from "components/Footers/AdminFooter";
import Login from '../views/examples/Login';

import UploadFiles from '../views/examples/UploadFiles';
import routes from "routes.js";
import Example from "../views/examples/Tabs";

class Admin extends React.Component {
  componentDidUpdate(e) {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.mainContent.scrollTop = 0;
  }
  getRoutes = routes => {
    return routes.map((prop, key) => {
      console.log(prop  )
      if (prop.layout === "/admin") {
        

          // console.log(prop.name)
          return (
            <Route
              path={prop.layout + prop.path}
              component={prop.component}
              key={key}
            />
          );
        
      }
       else {
        return null;
      }
    });
  };
  getBrandText = path => {
    for (let i = 0; i < routes.length+1; i++) {
      if (
        this.props.location.pathname.indexOf(
          routes[i].layout + routes[i].path
        ) !== -1
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  };
  render() {
    return (
      <>
        
        <div className="main-content" ref="mainContent">
          <AdminNavbar/>
          {/* <UploadFiles/> */}

          <Switch>{this.getRoutes(routes)}</Switch>
          <Example/>
          {/* <Container fluid> */}
          {/* <UploadFiles/> */}
          {/* <form className='add-product' onSubmit={this.submit}>
        <div className='form-group'>
          <input
            type='file'
            ref='myFile'
            onChange={this.onFileChange}
            className='form-control' />
        </div>
        <button
          type='submit'
          // disabled={!this.state.valid}
          className='btn btn-success' >
          Upload
        </button>
      </form> */}
            {/* <AdminFooter /> */}
          {/* </Container> */}
        </div>
      </>
    );
  }
}

export default Admin;
