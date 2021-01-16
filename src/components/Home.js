// This is the home page which displays the list of phones. Users are initially routed to this page.

import React from 'react';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import CardGroup from 'react-bootstrap/CardGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import { Phone } from 'react-bootstrap-icons';
import { TelephonePlus } from 'react-bootstrap-icons';
import { ArrowUp } from 'react-bootstrap-icons';
import { ArrowDown } from 'react-bootstrap-icons';
import PhoneCatalogService from '../services/PhoneCatalogService';
import Spinner from 'react-bootstrap/esm/Spinner';
import { Link } from 'react-router-dom';

// Homepage
class Home extends React.Component {

    // Set initial values
    constructor(props) {
        super(props);
        this.state = {
            dropValue: "Order By",
            isLoading: true, isError: false,
            phones: [], phonesTemp: []
        }
        this.onSearch = this.onSearch.bind(this);
    }

    // This method populates the phones list by making a call to the PhoneCatalogService
    async componentDidMount() {
        // Try sending request to REST API
        try {
            let result = await PhoneCatalogService.getCatalog();
            if (result.status == 200) {
                // If all good then render phones on screen
                this.setState({ isLoading: false, phones: result.data, phonesTemp: result.data });
            } else {
                // Otherwise display an error message
                this.setState({ isLoading: false, isError: true });
            }
            // If the app is unable to connect to the REST API
        } catch (err) {
            console.log(err);
            this.setState({ isLoading: false, isError: true });
        }
    }

    // Order phone list from lowest to highest price
    onPriceAsc = () => {
        this.setState({ dropValue: "Price Ascending", phones: this.state.phonesTemp.sort((a, b) => { return a.price - b.price }) });
    }
    // Order phone list from highest to lowest price
    onPriceDesc = () => {
        this.setState({ dropValue: "Price Descending", phones: this.state.phonesTemp.sort((a, b) => { return b.price - a.price }) });
    }
    // Order phones from oldest to newest
    onDateAsc = () => {
        this.setState({ dropValue: "Date Ascending", phones: this.state.phonesTemp.sort((a, b) => { return a.dateAdded < b.dateAdded ? -1 : 1 }) });
    }
    // Order phones from newest to oldest
    onDateDesc = () => {
        this.setState({ dropValue: "Date Descending", phones: this.state.phonesTemp.sort((a, b) => { return b.dateAdded < a.dateAdded ? -1 : 1 }) });
    }

    // This gets a list of phones matching the name that the user entered
    onSearch(value) {
        let tempPhones = [];
        for (let i = 0; i < this.state.phonesTemp.length; i++) {
            // If the phone's name contains the name entered then add it
            if (this.state.phonesTemp[i].name.toLowerCase().includes(value.toLowerCase())) {
                tempPhones.push(this.state.phonesTemp[i]);
            }
        }
        this.setState({ phones: tempPhones }); // Render phones mathing criteria
    }

    render() {
        // If an error occurred display error screen
        if (this.state.isError) {
            return <ErrorPage />;
        }
        return (
            <div className="m-2">
                <NavTop
                    dropValue={this.state.dropValue}
                    onPriceAsc={this.onPriceAsc}
                    onPriceDesc={this.onPriceDesc}
                    onDateAsc={this.onDateAsc}
                    onDateDesc={this.onDateDesc}
                    onSearch={this.onSearch}
                />
                {this.state.isLoading && <Spinner className="mt-3" animation="border" />}
                {!this.state.isLoading && <PhoneList phones={this.state.phones} />}
            </div>
        );
    }
}

// React component responsible for building the list of phones
const PhoneList = (props) => {
    let phonesList = [];
    // Display two phones side by side using cards
    for (let i = 1; i <= props.phones.length; i += 2) {
        if (i < props.phones.length) {
            phonesList.push(
                <CardGroup>
                    <Card className="my-2 mx-1">
                        <Card.Body>
                            <Card.Title>{props.phones[i - 1].name}</Card.Title>
                            <Card.Img src={props.phones[i - 1].imageFileName} />
                        </Card.Body>
                        <Card.Text className="mt-2 mx-2"><strong>Description:</strong> {props.phones[i - 1].description}</Card.Text>
                        <Card.Text><strong>Price:</strong> {props.phones[i - 1].price}</Card.Text>
                        <Container>
                            <Button className="mb-3" variant="primary">
                                <Link style={{ textDecoration: 'none', color: 'white' }} to={{ pathname: "/viewphone", phone: props.phones[i - 1] }}>More Info / Update</Link>
                            </Button>
                        </Container>
                        <Card.Footer>Date Added: {new Date(props.phones[i - 1].dateAdded).toUTCString()}</Card.Footer>
                    </Card>
                    <Card className="my-2 mx-1">
                        <Card.Body>
                            <Card.Title>{props.phones[i].name}</Card.Title>
                            <Card.Img src={props.phones[i].imageFileName} />
                        </Card.Body>
                        <Card.Text className="mt-2 mx-2"><strong>Description:</strong> {props.phones[i].description}</Card.Text>
                        <Card.Text><strong>Price:</strong> {props.phones[i].price}</Card.Text>
                        <Container>
                            <Button className="mb-3" variant="primary">
                                <Link style={{ textDecoration: 'none', color: 'white' }} to={{ pathname: "/viewphone", phone: props.phones[i] }}>More Info / Update</Link>
                            </Button>
                        </Container>
                        <Card.Footer>Date Added: {new Date(props.phones[i].dateAdded).toUTCString()}</Card.Footer>
                    </Card>
                </CardGroup>
            );
        } else if (i <= props.phones.length) {
            phonesList.push(
                <Container>
                    <Row>
                        <Col xs={6}>
                            <Card className="my-2 mx-1">
                                <Card.Body>
                                    <Card.Title>{props.phones[i - 1].name}</Card.Title>
                                    <Card.Img src={props.phones[i - 1].imageFileName} />
                                </Card.Body>
                                <Card.Text className="mt-2 mx-2"><strong>Description:</strong> {props.phones[i - 1].description}</Card.Text>
                                <Card.Text><strong>Price:</strong> {props.phones[i - 1].price}</Card.Text>
                                <Container>
                                    <Button className="mb-3" variant="primary">
                                        <Link style={{ textDecoration: 'none', color: 'white' }} to={{ pathname: "/viewphone", phone: props.phones[i - 1] }}>More Info / Update</Link>
                                    </Button>
                                </Container>
                                <Card.Footer>Date Added: {new Date(props.phones[i - 1].dateAdded).toUTCString()}</Card.Footer>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            );
        }
    }
    return (
        <Container>
            {phonesList}
        </Container>
    );
}

// Top navigation bar which allows users to search and order the collection of phones
class NavTop extends React.Component {

    // Set initial states
    constructor(props) {
        super(props);
        this.state = { searchValue: "" };
        this.search = this.search.bind(this);
    }

    // This calls its parent component Home to provide updated list of phones
    search() {
        this.props.onSearch(this.state.searchValue);
    }

    render() {
        return (
            <Navbar bg="light" expand="lg" sticky="top">
                <Navbar.Brand><Phone />Phone Catalog</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="/addphone"><TelephonePlus /> Add new phone</Nav.Link>
                        <NavDropdown title={this.props.dropValue} id="basic-nav-dropdown">
                            <NavDropdown.Item onClick={this.props.onPriceAsc}>Price <ArrowUp /></NavDropdown.Item>
                            <NavDropdown.Item onClick={this.props.onPriceDesc}>Price <ArrowDown /></NavDropdown.Item>
                            <NavDropdown.Item onClick={this.props.onDateAsc}>Date Added <ArrowUp /></NavDropdown.Item>
                            <NavDropdown.Item onClick={this.props.onDateDesc}>Date Added <ArrowDown /></NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Form inline>
                        <FormControl type="text" onChange={e => this.setState({ searchValue: e.target.value })} placeholder="Enter phone name" className="mr-sm-2" />
                        <Button variant="outline-dark" onClick={this.search}>Search</Button>
                    </Form>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

// A simple error message display in case items weren't loaded correctly
const ErrorPage = () => {
    return (
        <Container>
            <h2 className="m-2">An error has occurred</h2>
            <h4 className="m-2">Please make sure that the REST API is running</h4>
            <h4 className="m-2">If the REST API is running, please try refreshing the page</h4>
        </Container>
    );
}

export default Home;