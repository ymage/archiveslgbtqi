import { Container, Heading, Hr, Text } from "react-email";

interface ContactFormEmailProps {
  name: string;
  email: string;
  title: string;
  message: string;
  attachment?: string;
}

const ContactFormEmail: React.FC<Readonly<ContactFormEmailProps>> = ({
  name,
  email,
  title,
  message,
}) => (
  <Container>
    <Heading as="h3">Nom: {name}</Heading>
    <Heading as="h3">Adresse email: {email}</Heading>
    <Hr />
    <Text>{message}</Text>
  </Container>
);

export default ContactFormEmail;
