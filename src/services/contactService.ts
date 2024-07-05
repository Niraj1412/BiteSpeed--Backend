import { Op } from 'sequelize';
import Contact from '../models/contact';

export const identifyContact = async (email?: string, phoneNumber?: string) => {
  let existingContacts;
  if (email && phoneNumber) {
    existingContacts = await Contact.findAll({
      where: {
        [Op.or]: [{ email }, { phoneNumber }],
      },
    });
  } else if (email) {
    existingContacts = await Contact.findAll({ where: { email } });
  } else if (phoneNumber) {
    existingContacts = await Contact.findAll({ where: { phoneNumber } });
  } else {
    throw new Error('Either email or phoneNumber must be provided');
  }

  if (existingContacts.length === 0) {
    const newContact = await Contact.create({
      email,
      phoneNumber,
      linkPrecedence: 'primary',
    });
    return {
      primaryContatctId: newContact.id,
      emails: [email],
      phoneNumbers: [phoneNumber],
      secondaryContactIds: [],
    };
  }

  
  let primaryContact = existingContacts[0];
  let secondaryContacts = [];
  for (const contact of existingContacts) {
    if (contact.linkPrecedence === 'primary') {
      primaryContact = contact;
    } else {
      secondaryContacts.push(contact);
    }
  }

  const emails = new Set<string>();
  const phoneNumbers = new Set<string>();
  const secondaryContactIds = new Set<number>();

  emails.add(primaryContact.email as string);
  phoneNumbers.add(primaryContact.phoneNumber as string);
  for (const contact of secondaryContacts) {
    emails.add(contact.email as string);
    phoneNumbers.add(contact.phoneNumber as string);
    secondaryContactIds.add(contact.id);
  }

  if (email && !emails.has(email)) {
    const newSecondaryContact = await Contact.create({
      email,
      phoneNumber,
      linkedId: primaryContact.id,
      linkPrecedence: 'secondary',
    });
    secondaryContactIds.add(newSecondaryContact.id);
    emails.add(email);
  } else if (phoneNumber && !phoneNumbers.has(phoneNumber)) {
    const newSecondaryContact = await Contact.create({
      email,
      phoneNumber,
      linkedId: primaryContact.id,
      linkPrecedence: 'secondary',
    });
    secondaryContactIds.add(newSecondaryContact.id);
    phoneNumbers.add(phoneNumber);
  }

  return {
    primaryContatctId: primaryContact.id,
    emails: Array.from(emails),
    phoneNumbers: Array.from(phoneNumbers),
    secondaryContactIds: Array.from(secondaryContactIds),
  };
};
