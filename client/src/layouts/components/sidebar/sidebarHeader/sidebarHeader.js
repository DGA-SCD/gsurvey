// import external modules
import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { ToggleLeft, ToggleRight, X } from "react-feather";
// import internal(own) modules
import { FoldedContentConsumer } from "../../../../utility/context/toggleContentContext";
import Logo from "../../../../assets/img/logo3.png";
import LogoDark from "../../../../assets/img/logo-dark.png";
import templateConfig from "../../../../templateConfig";

class SidebarHeader extends Component {
  handleClick = e => {
    this.props.toggleSidebarMenu("close");
  };

  render() {
  
    console.log(JSON.stringify(this.props.display))
    return (
      <FoldedContentConsumer>
        {context => (
          <div className="sidebar-header">
            <div className="logo clearfix">
              <NavLink to="#" className="logo-text float-center">
                {this.props.display === 'none' ? (
                  <div className="logo-img" style={{ display: "none" }}>
                    {templateConfig.sidebar.backgroundColor === "white" ? (
                      this.props.sidebarBgColor === "" ||
                      this.props.sidebarBgColor === "white" ? (
                        <img src={LogoDark} alt="logo" />
                      ) : (
                        <img src={Logo} alt="logo" />
                      )
                    ) : this.props.sidebarBgColor === "white" ? (
                      <img src={LogoDark} alt="logo" />
                    ) : (
                      <img src={Logo} alt="logo" />
                    )}
                  </div>
                ) : (
                  <div className="logo-img">
                 
                    <img src={Logo} alt="logo" />
                  
                  </div>
                )}
                {/* <span className="text align-right">Survey</span> */}
              </NavLink>

              <span className="nav-toggle d-none d-sm-none d-md-none d-lg-block">
                {context.foldedContent ? (
                  <ToggleLeft
                    onClick={context.makeNormalContent}
                    className="toggle-icon"
                    size={16}
                  />
                ) : (
                  <ToggleRight
                    onClick={context.makeFullContent}
                    className="toggle-icon"
                    size={16}
                  />
                )}
              </span>
              <span
                href=""
                className="nav-close d-block d-md-block d-lg-none d-xl-none"
                id="sidebarClose"
              >
                <X onClick={this.handleClick} size={20} />
              </span>
            </div>
          </div>
        )}
      </FoldedContentConsumer>
    );
  }
}

export default SidebarHeader;
