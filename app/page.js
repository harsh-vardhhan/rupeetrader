"use client";
import {
  Input,
  Container,
  FormLabel,
  Stack,
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const CLIENT_ID = "Client ID";
  const API_SECRET = "API Secret";
  const REDIRECT_URL = "Redirect URL";
  const CODE = "Code";
  const ACCESS_TOKEN = "Access Token";

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

  const authorise = async () => {
    const authorizeUrl =
      "https://api.upstox.com/v2/login/authorization/dialog/";

    if (!clientId || !redirectUrl) {
      console.error(
        "CLIENT_ID or REDIRECT_URL is not defined in the environment variables.",
      );
      return;
    }

    const url = `${authorizeUrl}?client_id=${clientId}&redirect_uri=${redirectUrl}`;
    console.log(url);

    // Make the HTTP GET request using Axios
    try {
      const response = await axios.get(url);
      console.log(response.data); // handle response if needed
    } catch (error) {
      console.error("Error making the request:", error);
    }

    // Optionally, open the URL in the default browser
    open(url);
  };

  const login = async () => {
    try {
      if (!code || !clientId || !apiSecret || !redirectUrl) {
        console.error("Environment variables are not properly defined.");
        return;
      }

      const data = new URLSearchParams({
        code: code,
        client_id: clientId,
        client_secret: apiSecret,
        redirect_uri: redirectUrl,
        grant_type: "authorization_code",
      });

      const response = await axios.post(
        "https://api.upstox.com/v2/login/authorization/token",
        data,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
          },
        },
      );

      const userInfo = response.data;

      if (userInfo.access_token) {
        setAccessToken(userInfo.access_token);
        console.log("Access Token:", userInfo.access_token);
      } else {
        console.error("Error: access_token field not found");
      }
    } catch (error) {
      console.error("Error during login:", error.message || error);
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
  };

  return (
    <Container maxW="xl" style={{ marginTop: "30px" }}>
      <Tabs>
        <TabList>
          <Tab>Login</Tab>
          <Tab>Screener</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Stack spacing={3}>
              <div>
                <FormLabel>{CLIENT_ID}</FormLabel>
                <Input
                  value={clientId}
                  onChange={(event) => setClientId(event.target.value)}
                  placeholder={CLIENT_ID}
                  size="sm"
                />
                {}
              </div>
              <div>
                <FormLabel>{API_SECRET}</FormLabel>
                <Input
                  value={apiSecret}
                  onChange={(event) => setApiSecret(event.target.value)}
                  placeholder={API_SECRET}
                  size="sm"
                />
              </div>
              <div>
                <FormLabel>{REDIRECT_URL}</FormLabel>
                <Input
                  value={redirectUrl}
                  onChange={(event) => setRedirectUrl(event.target.value)}
                  placeholder={REDIRECT_URL}
                  size="sm"
                />
              </div>
              <Button colorScheme="blue" onClick={() => authorise()}>
                Authorise
              </Button>
              <div>
                <FormLabel>{CODE}</FormLabel>
                <Input
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  placeholder={CODE}
                  size="sm"
                />
              </div>
              <Button colorScheme="blue" onClick={() => login()}>
                Login
              </Button>
              <div>
                <FormLabel>{ACCESS_TOKEN}</FormLabel>
                <Input
                  value={accessToken}
                  onChange={(event) => setAccessToken(event.target.value)}
                  placeholder={ACCESS_TOKEN}
                  size="sm"
                />
              </div>
              <Button colorScheme="teal" onClick={() => save()}>
                Save
              </Button>
            </Stack>
          </TabPanel>
          <TabPanel>
            <p>Screener</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
}
