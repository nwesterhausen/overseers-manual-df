import { Component } from "solid-js";
import { Container, Navbar, Nav } from 'solid-bootstrap';
import { LIB_VERSION } from '../version';
import { AiFillGithub } from 'solidjs-icons/ai';

const HeaderBar: Component = () => {
    return (
        <Navbar bg="dark" variant="dark">
            <Container>
                <Navbar.Brand>
                    {"An Overseer's Reference Manual"}
                </Navbar.Brand>
                <Nav>
                    <ul class='list-inline text-light '>

                        <li class='list-inline-item  my-auto'>
                            Version: {LIB_VERSION}
                        </li>
                        <li class='list-inline-item  my-auto'>
                            <a href="" target="_blank" class='link-light icon-link'><AiFillGithub /></a>
                        </li>

                    </ul>
                </Nav>
            </Container>
        </Navbar>
    );
}

export default HeaderBar;