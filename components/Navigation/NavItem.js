import React from "react";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import { renderEmptyDiv } from "../../functions";

export default function NavItem(
  name,
  route,
  authenticated,
  hide_for_no_auth,
  loggedIn,
  type
) {
  const renderLink = (linkRoute, linkName) => {
    if (type === "nav-items") {
      return <Nav.Link href={linkRoute}>{linkName}</Nav.Link>;
    } else if (type === "nav-dropdown-items") {
      return <NavDropdown.Item href={linkRoute}>{linkName}</NavDropdown.Item>;
    }
  };

  const renderNavLink = () => {
    if (authenticated && !loggedIn && hide_for_no_auth) {
      renderEmptyDiv();
    } else if (authenticated && !loggedIn && !hide_for_no_auth) {
      return renderLink("/login", name);
    } else {
      return renderLink(route, name);
    }
  };

  return <>{renderNavLink()}</>;
}
