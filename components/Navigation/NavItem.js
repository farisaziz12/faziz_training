import React from "react";
import Nav from "react-bootstrap/Nav";
import { renderEmptyDiv } from "../../functions";

export default function NavItem(
  loggedIn,
  name,
  route,
  authenticated,
  hide_for_no_auth
) {
  const renderNavLink = () => {
    if (authenticated && !loggedIn && hide_for_no_auth) {
      renderEmptyDiv();
    } else if (authenticated && !loggedIn && !hide_for_no_auth) {
      return <Nav.Link href="/login">{name}</Nav.Link>;
    } else {
      return <Nav.Link href={route}>{name}</Nav.Link>;
    }
  };

  return <>{renderNavLink()}</>;
}
