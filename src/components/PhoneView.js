// This page shows more details about a phone and allows you to update its values

import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import { Phone } from 'react-bootstrap-icons';
import { Redirect } from 'react-router-dom';
import PhoneCatalogService from '../services/PhoneCatalogService';

// Allows users to update and view a phone from the catalog
class PhoneView extends React.Component {

    // Set initial states
    constructor(props) {
        super(props);
        this.renderImage = this.renderImage.bind(this);
        this.readFile = this.readFile.bind(this);
        this.state = {
            phoneName: "", manufacturer: "", 
            description: "", color: "",
            price: -1, imageURL: "", imageObj: null,
            screen: "", processor: "", ram: -1,
            showModal: false, isLoading: false,
            updateVals: {}, redirect: false
        };
    }

    // This displays the users selected picture and updates the image to be uploaded
    renderImage(val) {
        this.setState({
            imageURL: URL.createObjectURL(val),
            imageObj: val
        });
    }

    // Used to display and hide the modal pop-up
    handleClose = () => {this.setState({showModal: false});}
    handleShow = () => {this.setState({showModal: true});}

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

    // If user confirms their intention with the modal pop-up
    completeUpdate = async () => {
        // Process the changes made
        this.handleClose();

        this.setState({isLoading: true});

        // If user wants to update image
        if (this.state.updateVals.imageFileName != null) {
            // Encode the image
            const contents = await this.readFile(this.state.updateVals.imageFileName);
            this.state.updateVals.imageFileName = contents;
        }

        PhoneCatalogService.updatePhone(this.props.location.phone.id, this.state.updateVals).then(() => {
            this.setState({updateVals: {}, isLoading: false});
        });

    }

    // Remove this phone from the catalog perminently
    handleDelete = () => {
        this.setState({isLoading: true});

        PhoneCatalogService.deletePhone(this.props.location.phone.id).then(() => {
            this.setState({redirect: true}); // Go back to home page
        })

    }

    // Creates an array of values that need updating and displays a confirmation pop up
    handleUpdate = () => {

        let tempVals = {};

        if (this.state.phoneName != "") {
            tempVals.name = this.state.phoneName;
        }
        if (this.state.manufacturer != "") {
            tempVals.manufacturer = this.state.manufacturer;
        }
        if (this.state.description != "") {
            tempVals.description = this.state.description;
        }
        if (this.state.color != "") {
            tempVals.color = this.state.color;
        }
        if (this.state.price > 0) {
            tempVals.price = this.state.price;
        }
        if (this.state.imageObj != null) {
            tempVals.imageFileName = this.state.imageObj;
        }
        if (this.state.screen != "") {
            tempVals.screen = this.state.screen;
        }
        if (this.state.processor != "") {
            tempVals.processor = this.state.processor;
        }
        if (this.state.ram > 0) {
            tempVals.ram = this.state.ram;
        }

        // If changes have been made
        if (Object.keys(tempVals).length > 0) {
            this.setState({updateVals: tempVals});

            this.handleShow();
        }
        
    }

    render() {
        if (this.state.redirect) return <Redirect to="/" />;
        try {
            let temp = this.props.location.phone.name; // Check that a phone has been passed to this address
        } catch {
            return <Redirect to="/invalid" />; // If not, the user did not access this page through the appropriate link
        }
        return (
            <Container>

                <h2 class="mt-3">View or update phone</h2>

                <Modal
                    show={this.state.showModal}
                    onHide={this.handleClose}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Update Phone</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to make changes to this phone?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={this.handleClose}>No</Button>
                        <Button variant="success" onClick={this.completeUpdate}>Yes</Button>
                    </Modal.Footer>
                </Modal>

                <Form>

                    <Container className="mt-3">
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Phone name</Form.Label>
                                    <Form.Control type="text" onChange={e => this.setState({ phoneName: e.target.value })} placeholder={this.props.location.phone.name} />
                                    <Form.Text className="text-danger">{this.state.phoneNameError}</Form.Text>
                                </Form.Group>
                            </Col>

                            <Col>
                                <Form.Group>
                                    <Form.Label>Manufacturer</Form.Label>
                                    <Form.Control type="text" onChange={e => this.setState({ manufacturer: e.target.value })} placeholder={this.props.location.phone.manufacturer} />
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
                                    <Form.Control type="text" onChange={e => this.setState({ screen: e.target.value })} placeholder={this.props.location.phone.screen} />
                                    <Form.Text className="text-danger">{this.state.screenError}</Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Processor</Form.Label>
                                    <Form.Control type="text" onChange={e => this.setState({ processor: e.target.value })} placeholder={this.props.location.phone.processor} />
                                    <Form.Text className="text-danger">{this.state.processorError}</Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Container>

                    <Image src={this.state.imageURL == "" ? this.props.location.phone.imageFileName : this.state.imageURL} className="mb-3" width="50%" rounded />

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
                            <Form.Control as="textarea" rows={2} onChange={e => this.setState({ description: e.target.value })} placeholder={this.props.location.phone.description} />
                            <Form.Text className="text-danger">{this.state.descriptionError}</Form.Text>
                        </Form.Group>
                    </Container>

                    <Container>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Ram</Form.Label>
                                    <Form.Control type="number" onChange={e => this.setState({ ram: e.target.value })} placeholder={this.props.location.phone.ram} />
                                    <Form.Text className="text-danger">{this.state.ramError}</Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Price</Form.Label>
                                    <Form.Control type="number" onChange={e => this.setState({ price: e.target.value })} placeholder={this.props.location.phone.price} />
                                    <Form.Text className="text-danger">{this.state.priceError}</Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Container>

                    {this.state.isLoading && <Alert variant="primary">
                        <Alert.Heading>Processing...</Alert.Heading>
                        <p>Please be patient</p>
                    </Alert>}

                    <Container className="mb-3">
                        <Row>
                            <Col>
                                <Dropdown>
                                    <Dropdown.Toggle variant="outline-dark">{this.state.color === "" ? this.props.location.phone.color : this.state.color}</Dropdown.Toggle>
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
                                <Button variant="outline-danger" onClick={this.handleDelete} type="button">Delete Phone</Button>
                            </Col>
                            <Col>
                                <Button variant="outline-success" onClick={this.handleUpdate} type="button"><Phone /> Update Phone</Button>
                            </Col>
                        </Row>
                    </Container>

                </Form>
            </Container>
        );
    }
}

export default PhoneView;