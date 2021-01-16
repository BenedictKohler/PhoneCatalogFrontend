// This service communicates with the Phone Catalog REST API in the Backend Folder which then updates the cloud firestore database

import axios from 'axios';

// A class that is used in the React app to communicate with the REST API
class PhoneCatalogService {

    // Returns all phones from the database
    async getCatalog() {
        return await axios.get('http://localhost:8000/phones');
    }

    // Returns a phone by id
    async getPhone(id) {
        return await axios.get('http://localhost:8000/phone/' + id.toString());
    }

    // Creates a new phone
    async createPhone(data) {
        await axios.post("http://localhost:8000/phone", data);
    }

    // Updates an existing phone
    async updatePhone(id, data) {
        return await axios.put('http://localhost:8000/phone/' + id.toString(), data);
    }

    // Deletes a phone by id
    async deletePhone(id) {
        await axios.delete('http://localhost:8000/phone/' + id.toString());
    }

}

export default new PhoneCatalogService();