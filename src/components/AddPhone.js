// This page is shown when a user would like to add a new phone to the catalog

import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import { Phone } from 'react-bootstrap-icons';
import { Redirect } from 'react-router-dom';
import PhoneCatalogService from '../services/PhoneCatalogService';
import Alert from 'react-bootstrap/Alert';

// Component for adding a new phone
class AddPhone extends React.Component {

    // Sets initial states
    constructor(props) {
        super(props);
        this.renderImage = this.renderImage.bind(this);
        this.readFile = this.readFile.bind(this);
        this.state = {
            phoneName: "", phoneNameError: "",
            manufacturer: "", manufacturerError: "",
            description: "", descriptionError: "",
            color: "Select phone color", colorError: "",
            price: -1, priceError: "",
            // This is placeholder picture
            imageURL: "https://media.istockphoto.com/photos/mobile-phone-top-view-with-white-screen-picture-id1161116588?k=6&m=1161116588&s=612x612&w=0&h=egtA8uC2OHEiW9s7qH1pQI8nkLLvJLJRBCsEbii-c2c=",
            imageObj: null, imageError: "",
            screen: "", screenError: "",
            processor: "", processorError: "",
            ram: -1, ramError: "",
            redirect: false, isLoading: false
        };
    }

    // This displays the users selected picture and updates the image to be uploaded
    renderImage(val) {
        this.setState({
            imageURL: URL.createObjectURL(val),
            imageObj: val
        });
    }

    // Converts the image to Base64 for easier upload
    readFile(file) {
        return new Promise((resolve, reject) => {

            const reader = new FileReader();

            reader.onload = res => {
                resolve(res.target.result);
            };

            reader.onerror = err => reject(err);

            reader.readAsDataURL(file);
        });
    }

    // This makes sure that the user has entered valid information before posting it
    handleInfo = async () => {
        // Possible errors
        let isError = false;
        let pError, mError, dError, cError, prError, iError, sError, procError, rError = "";

        // Check for errors
        if (this.state.phoneName.length < 1) {
            pError = "This field can't be empty";
            isError = true;
        }
        if (this.state.manufacturer.length < 1) {
            mError = "This field can't be empty";
            isError = true;
        }
        if (this.state.description.length < 1) {
            dError = "This field can't be empty";
            isError = true;
        }
        if (this.state.color === "Select phone color") {
            cError = "This field can't be empty";
            isError = true;
        }
        if (this.state.price <= 0) {
            prError = "The phone needs a nonzero price";
            isError = true;
        }
        if (this.state.imageObj == null) {
            iError = "An image of the phone is required";
            isError = true;
        }
        if (this.state.screen.length < 1) {
            sError = "This field can't be empty";
            isError = true;
        }
        if (this.state.processor.length < 1) {
            procError = "This field can't be empty";
            isError = true;
        }
        if (this.state.ram < 1) {
            rError = "This field can't be empty";
            isError = true;
        }

        // If there's an error display it for user to fix
        if (isError) {
            this.setState({
                phoneNameError: pError, manufacturerError: mError, descriptionError: dError, colorError: cError,
                priceError: prError, imageError: iError, screenError: sError, processorError: procError, ramError: rError
            });
            // Otherwise, upload info and navigate back to homescreen when done
        } else {

            // Display loading alert
            this.setState({ isLoading: true });

            // Encode the image
            const contents = await this.readFile(this.state.imageObj);

            // Send the information
            PhoneCatalogService.createPhone({
                name: this.state.phoneName, manufacturer: this.state.manufacturer, description: this.state.description,
                color: this.state.color, price: this.state.price, imageFileName: contents, screen: this.state.screen,
                processor: this.state.processor, ram: this.state.ram
            }).then(() => {
                this.setState({ redirect: true }); // Go to home page
            });

        }
    }


    render() {
        if (this.state.redirect) return <Redirect to="/" />
        return (
            <Container>

                <h2 class="mt-3">Add a new phone</h2>

                <Form>

                    <Container className="mt-3">
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Phone name</Form.Label>
                                    <Form.Control type="text" onChange={e => this.setState({ phoneName: e.target.value })} placeholder="Phone name" />
                                    <Form.Text className="text-danger">{this.state.phoneNameError}</Form.Text>
                                </Form.Group>
                            </Col>

                            <Col>
                                <Form.Group>
                                    <Form.Label>Manufacturer</Form.Label>
                                    <Form.Control type="text" onChange={e => this.setState({ manufacturer: e.target.value })} placeholder="Manufacturer" />
                                    <Form.Text className="text-danger">{this.state.manufacturerError}</Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Container>

                    <Container>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Screen</Form.Label>
                                    <Form.Control type="text" onChange={e => this.setState({ screen: e.target.value })} placeholder="Enter screen size" />
                                    <Form.Text className="text-danger">{this.state.screenError}</Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Processor</Form.Label>
                                    <Form.Control type="text" onChange={e => this.setState({ processor: e.target.value })} placeholder="Enter processor info" />
                                    <Form.Text className="text-danger">{this.state.processorError}</Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Container>

                    <Image src={this.state.imageURL} className="mb-3" width="50%" rounded />

                    <Container>
                        <Form.Group>
                            <Form.File
                                label="Select image of phone"
                                custom
                                onChange={e => this.renderImage(e.target.files[0])}
                            />
                            <Form.Text className="text-danger">{this.state.imageError}</Form.Text>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={2} onChange={e => this.setState({ description: e.target.value })} placeholder="Write a brief description about the phone" />
                            <Form.Text className="text-danger">{this.state.descriptionError}</Form.Text>
                        </Form.Group>
                    </Container>

                    <Container>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Ram</Form.Label>
                                    <Form.Control type="number" onChange={e => this.setState({ ram: e.target.value })} placeholder="Enter ram amount" />
                                    <Form.Text className="text-danger">{this.state.ramError}</Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Price</Form.Label>
                                    <Form.Control type="number" onChange={e => this.setState({ price: e.target.value })} placeholder="Enter price" />
                                    <Form.Text className="text-danger">{this.state.priceError}</Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Container>

                    {this.state.isLoading && <Alert variant="primary">
                        <Alert.Heading>Processing...</Alert.Heading>
                        <p>Please wait to be redirected to the home screen</p>
                    </Alert>}

                    <Container className="mb-3">
                        <Row>
                            <Col>
                                <Dropdown>
                                    <Dropdown.Toggle variant="outline-dark">{this.state.color}</Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => this.setState({ color: "Black" })} >Black</Dropdown.Item>
                                        <Dropdown.Item onClick={() => this.setState({ color: "Purple" })} >Purple</Dropdown.Item>
                                        <Dropdown.Item onClick={() => this.setState({ color: "Silver" })} >Silver</Dropdown.Item>
                                        <Dropdown.Item onClick={() => this.setState({ color: "White" })} >White</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                                <Form.Text className="text-danger">{this.state.colorError}</Form.Text>
                            </Col>
                            <Col>
                                <Button variant="outline-success" onClick={this.handleInfo} type="button"><Phone /> Create Phone</Button>
                            </Col>
                        </Row>
                    </Container>

                </Form>
            </Container>
        );
    }
}

export default AddPhone;