import Contact from './contact';

const dbInit = async () => {
  await Contact.sync({ alter: true });
};

export { dbInit, Contact };
