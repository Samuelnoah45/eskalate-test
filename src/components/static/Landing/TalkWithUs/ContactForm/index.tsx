'use client';
import { Notification } from '@mantine/core';
import { Button, Card, Grid, Stack, TextInput, Textarea } from '@mantine/core';
import { useState } from 'react';
import { useContactUsMutation } from '@/lib/redux/api/contact/contactApi';
import { handleError } from '@/utils/error_handler';
import { toast } from 'react-toastify';
const ContactForm = () => {
    const [ContactUs] = useContactUsMutation();
    const [firstname, setfirstname] = useState('');
    const [lastname, setlastname] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setphoneNumber] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [notify, setNofity] = useState(false);

    const handleSendMessage = async () => {
        if (!firstname || !lastname || !email || !phoneNumber || !message) {
            return;
        }
        const data = {
            firstname,
            lastname,
            email,
            phoneNumber,
            message
        };
        setLoading(true);

        try {
            const response = await ContactUs(data);
            if (response) {
                setLoading(false);
                setfirstname('');
                setlastname('');
                setEmail('');
                setphoneNumber('');
                setMessage('');
                setNofity(true);
                setTimeout(() => {
                    setNofity(false);
                }, 1500);
            }
        } catch (error) {
            const errorMessage = handleError(error);
            if (errorMessage) {
                toast.error(errorMessage);
            }
        }
    };

    return (
        <Stack
            mt={50}
            align="center"
            style={{ width: '' }}
            mb={20}
            px={{ base: 16 }}
        >
            {notify && (
                <Notification
                    style={{
                        display: 'flex',
                        justifyContent: 'end',
                        alignItems: 'end'
                    }}
                    title="Success!"
                >
                    We have Successfully Recieved Your Message, Thank You !!
                </Notification>
            )}

            <Card
                bg="white"
                w={{ base: '400px', md: '440px' }}
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    height: '400px',
                    paddingRight: '30px',
                    paddingLeft: '30px',
                    borderRadius: '8px',
                    gap: '20px',
                    overflow: 'scroll'
                }}
            >
                <Grid gutter="15px">
                    <Grid.Col span={6}>
                        <TextInput
                            value={firstname}
                            onChange={(e) =>
                                setfirstname(e.currentTarget.value)
                            }
                            required
                            radius={10}
                            size="lg"
                            placeholder="First Name*"
                        />
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <TextInput
                            value={lastname}
                            onChange={(e) => setlastname(e.currentTarget.value)}
                            required
                            radius={10}
                            size="lg"
                            placeholder="Last Name*"
                        />
                    </Grid.Col>
                </Grid>
                <Stack>
                    <TextInput
                        value={email}
                        onChange={(e) => setEmail(e.currentTarget.value)}
                        required
                        radius={10}
                        size="lg"
                        placeholder="Email*"
                    />
                </Stack>
                <Stack>
                    <TextInput
                        value={phoneNumber}
                        onChange={(e) => setphoneNumber(e.currentTarget.value)}
                        required
                        radius={10}
                        size="lg"
                        placeholder="PhoneNumber*"
                    />
                </Stack>
                <Stack>
                    <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.currentTarget.value)}
                        minRows={8}
                        resize="vertical"
                        size="xl"
                        placeholder="Your message..."
                    />
                </Stack>
                <Stack>
                    <Button
                        loading={loading}
                        onClick={handleSendMessage}
                        variant="filled"
                        size="md"
                        fw="normal"
                        radius="8px"
                        bg="#2195F3"
                    >
                        Send Message
                    </Button>
                </Stack>
            </Card>
        </Stack>
    );
};

export default ContactForm;
