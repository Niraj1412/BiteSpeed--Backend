import { Request, Response } from 'express';
import Contact from '../models/contact'; 


export const identify = async (req: Request, res: Response) => {
  try {
    const { email, phoneNumber } = req.body;

    let primaryContact: Contact | null = null;
    let secondaryContacts: Contact[] = [];

    
    const contactsByEmail = email ? await Contact.findAll({ where: { email } }) : [];
    const contactsByPhoneNumber = phoneNumber ? await Contact.findAll({ where: { phoneNumber } }) : [];

    const allContacts = [...contactsByEmail, ...contactsByPhoneNumber];

    if (allContacts.length > 0) {
    
      primaryContact = allContacts.find(contact => contact.linkPrecedence === 'primary') || null;

      if (primaryContact) {
    
        secondaryContacts = allContacts.filter(contact => contact.linkPrecedence === 'secondary' || contact.id !== primaryContact!.id);
      } else {
    
        primaryContact = allContacts.reduce((prev, curr) => (prev.createdAt < curr.createdAt ? prev : curr), allContacts[0]);
        secondaryContacts = allContacts.filter(contact => contact.id !== primaryContact!.id);
      }
    }

 
    if (!primaryContact) {
      primaryContact = await Contact.create({
        email,
        phoneNumber,
        linkPrecedence: 'primary',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } else {
  
      if (email || phoneNumber) {
        const secondaryContact = await Contact.create({
          email,
          phoneNumber,
          linkedId: primaryContact.id,
          linkPrecedence: 'secondary',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        secondaryContacts.push(secondaryContact);
      }
    }

    
    const emails = new Set<string>();
    const phoneNumbers = new Set<string>();

    if (primaryContact && primaryContact.email) {
      emails.add(primaryContact.email);
    }
    if (primaryContact && primaryContact.phoneNumber) {
      phoneNumbers.add(primaryContact.phoneNumber);
    }

    secondaryContacts.forEach(contact => {
      if (contact.email) {
        emails.add(contact.email);
      }
      if (contact.phoneNumber) {
        phoneNumbers.add(contact.phoneNumber);
      }
    });

  
    const response = {
      contact: {
        primaryContatctId: primaryContact!.id,
        emails: Array.from(emails),
        phoneNumbers: Array.from(phoneNumbers),
        secondaryContactIds: secondaryContacts.map(contact => contact.id),
      },
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while identifying contacts' });
  }
};
