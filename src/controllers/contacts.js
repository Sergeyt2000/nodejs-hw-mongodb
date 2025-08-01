import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import createHttpError from 'http-errors';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';
import * as fs from 'node:fs/promises';


export const getAllContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortOrder, sortBy } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const contacts = await getAllContacts(
    page,
    perPage,
    sortOrder,
    sortBy,
    filter,
    req.user.id,
  );

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res) => {
  const contactId = req.params.contactId;

  const contact = await getContactById(contactId, req.user.id);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  let contact;
  if (req.file) {
    const result = await uploadToCloudinary(req.file.path);
    await fs.unlink(req.file.path);

    contact = await createContact({
      ...req.body,
      // photo: `http://localhost:3000/photo/${req.file.filename}`,
      photo: result.secure_url,
      userId: req.user.id,
    });
  } else {
    contact = await createContact({
      ...req.body,
      userId: req.user.id,
    });
  }

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const updateContactController = async (req, res) => {
  const { contactId } = req.params;

  let updatedContact;
  if (req.file) {
    const result = await uploadToCloudinary(req.file.path);
    await fs.unlink(req.file.path);

    updatedContact = await updateContact(
      contactId,
      req.body,
      req.user.id,
      result.secure_url,
    );
  } else {
    updatedContact = await updateContact(
      contactId,
      req.body,
      req.user.id,
    );
  }

  if (!updatedContact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const deletedContact = await deleteContact(contactId, req.user.id);

  if (!deletedContact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
};
