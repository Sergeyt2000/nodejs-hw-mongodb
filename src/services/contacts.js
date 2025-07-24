import { ContactsCollection } from '../models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/constants.js';

export const getAllContacts = async (
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
  userId,
) => {
  const limit = perPage;
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const contactsQuery = ContactsCollection.find({ userId });

  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }
  if (filter.isFavourite !== undefined) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  const [contactsCount, contacts] = await Promise.all([
    ContactsCollection.find().merge(contactsQuery).countDocuments(),
    contactsQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .collation({ locale: 'en', strength: 2 }) // для сортування нечутливого до регістру
      .exec(),
  ]);

  // const contactsCount = await ContactsCollection.find()
  //   .merge(contactsQuery)
  //   .countDocuments();

  // const contacts = await contactsQuery
  //   .skip(skip)
  //   .limit(limit)
  //   .sort({ [sortBy]: sortOrder })
  //   .exec();

  const paginationData = calculatePaginationData(contactsCount, page, perPage);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (id, userId) => {
  const contact = await ContactsCollection.findOne({ _id: id, userId });
  return contact;
};

export const createContact = async (payload) => {
  const newContact = await ContactsCollection.create(payload);
  return newContact;
};

export const updateContact = async (id, payload, userId) => {
  // const updatedContact = await ContactsCollection.findByIdAndUpdate(
  //   id, payload, { new: true });
  const updatedContact = await ContactsCollection.findOneAndUpdate(
    { _id: id, userId },
    payload,
    { new: true },
  );
  return updatedContact;
};

export const deleteContact = async (id, userId) => {
  // const deletedContact = await ContactsCollection.findByIdAndDelete(id); //findOneAndDelete({_id: id});
  const deletedContact = await ContactsCollection.findOneAndDelete({
    _id: id,
    userId,
  });
  return deletedContact;
};
