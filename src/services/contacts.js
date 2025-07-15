import { ContactsCollection } from '../models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/constants.js';

// export const getAllContacts = async () => {
//   const contacts = await ContactsCollection.find();
//   return contacts;
// };

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = ContactsCollection.find();
  const contactsCount = await ContactsCollection.find()
    .merge(contactsQuery)
    .countDocuments();

  const contacts = await contactsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();
  const paginationData = calculatePaginationData(contactsCount, page, perPage);

  return {
    data: contacts,
    ...paginationData,
  };
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
      new: true,
    },
  );
  return updatedContact;
};

export const deleteContact = async (id) => {
  const deletedContact = await ContactsCollection.findByIdAndDelete(id); //findOneAndDelete({_id: id});
  return deletedContact;
};
