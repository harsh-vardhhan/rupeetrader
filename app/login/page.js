"use client";
import {
  Input,
  Container,
  FormLabel,
  Stack,
  Button,
  Card,
  Heading,
  useToast,
  Alert,
  AlertIcon,
  AlertDescription,
  Box,
  CardBody,
} from "@chakra-ui/react";
import Image from "next/image";
import Header from "../header";
import { authorise, login } from "../api";
import { useState, useEffect } from "react";

const Login = () => {
  const CLIENT_ID_KEY = "clientId";
  const API_SECRET_KEY = "apiSecret";
  const REDIRECT_URL_KEY = "redirectUrl";
  const CODE_KEY = "code";
  const ACCESS_TOKEN_KEY = "accessToken";

  const [clientId, setClientId] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [code, setCode] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const toast = useToast();

  const handleAuthorise = async () => {
    await authorise(clientId, redirectUrl);
  };

  const handleLogin = async () => {
    const accessToken = await login(code, clientId, apiSecret, redirectUrl);
    if (accessToken.success) {
      toast({
        title: "Access token updated",
        description: "We've saved access token for you.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      setAccessToken(accessToken.access_token);
    } else {
      toast({
        title: "Failed to get access token",
        description: "failed to save access token",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    const clientIdKey = localStorage.getItem(CLIENT_ID_KEY);
    if (clientIdKey) {
      setClientId(clientIdKey);
    }
    const apiSecretKey = localStorage.getItem(API_SECRET_KEY);
    if (apiSecretKey) {
      setApiSecret(apiSecretKey);
    }
    const redirectUrlKey = localStorage.getItem(REDIRECT_URL_KEY);
    if (redirectUrlKey) {
      setRedirectUrl(redirectUrlKey);
    }
    const codeKey = localStorage.getItem(CODE_KEY);
    if (codeKey) {
      setCode(codeKey);
    }
    const accessTokenKey = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (accessTokenKey) {
      setAccessToken(accessTokenKey);
    }
  }, []);

  const save = () => {
    localStorage.setItem(CLIENT_ID_KEY, clientId);
    localStorage.setItem(API_SECRET_KEY, apiSecret);
    localStorage.setItem(REDIRECT_URL_KEY, redirectUrl);
    localStorage.setItem(CODE_KEY, code);
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    toast({
      title: "Login details saved",
      description: "login details saved locally",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
  };

  return (
    <div>
      <Header />
      <Container maxW="xl" style={{ marginTop: 10 }}>
        <Stack spacing={3}>
          <Alert status="info">
            <AlertIcon />
            <Box>
              <AlertDescription>
                <b>Authorise</b> and <b>Login</b> everyday to generate a fresh
                access token and then <b>Save</b> it
              </AlertDescription>
            </Box>
          </Alert>
          <Card>
            <CardBody>
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  For first time users:
                </Heading>

                <Button
                  style={{ marginTop: 10 }}
                  colorScheme="teal"
                  onClick={() =>
                    window.open("https://account.upstox.com/developer/apps")
                  }
                >
                  Create Upstox App
                </Button>
              </Box>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Get Redirect url from edit
                </Heading>
                <Image
                  src="/my-apps.png"
                  width={500}
                  height={500}
                  alt="client id and api secret"
                />
              </Box>
            </CardBody>
          </Card>
          <div>
            <FormLabel>Client ID</FormLabel>
            <Input
              value={clientId}
              onChange={(event) => setClientId(event.target.value)}
              placeholder="Client ID"
              size="sm"
            />
          </div>
          <div>
            <FormLabel>API Secret</FormLabel>
            <Input
              value={apiSecret}
              onChange={(event) => setApiSecret(event.target.value)}
              placeholder="API Secret"
              size="sm"
            />
          </div>
          <Card>
            <CardBody>
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Get Redirect url from edit
                </Heading>
                <Image
                  src="/redirect.png"
                  width={500}
                  height={500}
                  alt="code in app"
                />
              </Box>
            </CardBody>
          </Card>
          <div>
            <FormLabel>Redirect URL</FormLabel>
            <Input
              value={redirectUrl}
              onChange={(event) => setRedirectUrl(event.target.value)}
              placeholder="Redirect URL"
              size="sm"
            />
          </div>
          <Button colorScheme="blue" onClick={handleAuthorise}>
            Authorise
          </Button>
          <Card>
            <CardBody>
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Get code from url
                </Heading>
                <Image
                  src="/code.png"
                  width={500}
                  height={500}
                  alt="code in app"
                />
              </Box>
            </CardBody>
          </Card>
          <div>
            <FormLabel>Code</FormLabel>
            <Input
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="Code"
              size="sm"
            />
          </div>
          <Button colorScheme="blue" onClick={handleLogin}>
            Login
          </Button>
          <div>
            <FormLabel>Access Token</FormLabel>
            <Input
              value={accessToken}
              onChange={(event) => setAccessToken(event.target.value)}
              placeholder="Access Token"
              size="sm"
            />
          </div>
          <Button colorScheme="teal" onClick={save}>
            Save
          </Button>
        </Stack>
      </Container>
    </div>
  );
};

export default Login;
