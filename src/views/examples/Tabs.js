import React from 'react';
import '../../assets/css/style.css'
import { 
TabContent, 
TabPane, 
Nav, 
NavItem, 
NavLink, 
Card, 
Button, 
CardTitle, 
CardText, 
Row, 
Col } from 'reactstrap';
import classnames from 'classnames';
import UploadFiles from './UploadFiles';
import CreateReadData from './CRData';

export default class Example extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);

    this.state = {
      activeTab: '1'
    };
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({

        activeTab: tab
      });
    }

    if (this.state.active === tab) {
    
    } else {
      this.setState({active : tab})
    }
  }

  render() {
    return (
      <div>
        <Nav tabs className = "tabStyling">
          <NavItem>
            <NavLink className = "tabs"
            // style = {{backgroundColor: this.myColor('2')}}
              className={classnames({ active: this.state.activeTab === '1' })}
              onClick={() => { this.toggle('1'); }}
            >
              Upload File
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              // style = {{backgroundColor: this.myColor('2')}}
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => { this.toggle('2'); }}
            >
              Read Data
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <Row>
              <Col sm="12">
                <UploadFiles/>
                {/* <h4>Tab 1 Contents</h4> */}
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row>
              <Col sm="12">
                <CreateReadData/>
              </Col>
            </Row>
          </TabPane>
        </TabContent>
      </div>
    );
  }
}