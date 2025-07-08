import { ContactsCollection } from '../models/contact.js';

export const getAllContacts = async () => {
    const contacts = await ContactsCollection.find();
    return contacts;
};
export const getContactById = async (id) => {
    const contact = await ContactsCollection.findById(id);
    return contact;
};

export const createContact = async (payload) => {
    const newContact = await ContactsCollection.create(payload);
    return newContact;
};
