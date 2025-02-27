"use client";

import { 
  Container, 
  Title, 
  Text, 
  Stack,
  TextInput,
  Textarea,
  Button,
  Paper,
  Select,
  Alert
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconSend } from '@tabler/icons-react';
import { useState } from 'react';

interface ContactFormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ContactFormValues>({
    initialValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
    validate: {
      name: (value) => value.trim().length < 2 ? 'Name must be at least 2 characters' : null,
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      subject: (value) => !value ? 'Please select a subject' : null,
      message: (value) => value.trim().length < 10 ? 'Message must be at least 10 characters' : null,
    },
  });

  const handleSubmit = (values: ContactFormValues) => {
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', values);
    setSubmitted(true);
    form.reset();
  };

  return (
    <Container size="sm" py="xl">
      <Stack gap="lg">
        <div>
          <Title order={1} mb="sm">Contact Us</Title>
          <Text c="dimmed" size="lg">
            Get in touch with us for any inquiries or support. We&apos;ll get back to you as soon as possible.
          </Text>
        </div>

        {submitted && (
          <Alert 
            title="Message Sent" 
            color="green" 
            variant="filled" 
            mb="md"
            onClose={() => setSubmitted(false)}
            withCloseButton
          >
            Thank you for your message. We&apos;ll get back to you soon!
          </Alert>
        )}

        <Paper withBorder radius="md" p="xl">
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput
                label="Name"
                placeholder="Your name"
                required
                {...form.getInputProps('name')}
              />

              <TextInput
                label="Email"
                placeholder="your@email.com"
                required
                {...form.getInputProps('email')}
              />

              <Select
                label="Subject"
                placeholder="Select a subject"
                required
                data={[
                  { value: 'general', label: 'General Inquiry' },
                  { value: 'support', label: 'Technical Support' },
                  { value: 'feedback', label: 'Feedback' },
                  { value: 'business', label: 'Business Inquiry' },
                ]}
                {...form.getInputProps('subject')}
              />

              <Textarea
                label="Message"
                placeholder="Your message"
                required
                minRows={4}
                autosize
                {...form.getInputProps('message')}
              />

              <Button 
                type="submit"
                leftSection={<IconSend size={16} />}
                mt="md"
              >
                Send Message
              </Button>
            </Stack>
          </form>
        </Paper>
      </Stack>
    </Container>
  );
}
