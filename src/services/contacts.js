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

export const updateContact = async (id, payload) => {
  const updatedContact = await ContactsCollection.findByIdAndUpdate(
    id,
    payload,
    {
      new: true
    },
  );
  return updatedContact;
};

export const deleteContact = async (id) => {
  const deletedContact = await ContactsCollection.findByIdAndDelete(id); //findOneAndDelete({_id: id});
  return deletedContact;
};
