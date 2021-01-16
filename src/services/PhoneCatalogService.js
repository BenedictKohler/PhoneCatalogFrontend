// This service communicates with the Phone Catalog REST API in the Backend Folder which then updates the cloud firestore database

import axios from 'axios';

// A class that is used in the React app to communicate with the REST API
class PhoneCatalogService {

    // Returns all phones from the database
    async getCatalog() {
        return await axios.get('https://phone-catalog-backend.herokuapp.com/phones');
    }

    // Returns a phone by id
    async getPhone(id) {
        return await axios.get('https://phone-catalog-backend.herokuapp.com/phone/' + id.toString());
    }

    // Creates a new phone
    async createPhone(data) {
        await axios.post("https://phone-catalog-backend.herokuapp.com/phone", data);
    }

    // Updates an existing phone
    async updatePhone(id, data) {
        return await axios.put('https://phone-catalog-backend.herokuapp.com/phone/' + id.toString(), data);
    }

    // Deletes a phone by id
    async deletePhone(id) {
        await axios.delete('https://phone-catalog-backend.herokuapp.com/phone/' + id.toString());
    }

}

export default new PhoneCatalogService();
