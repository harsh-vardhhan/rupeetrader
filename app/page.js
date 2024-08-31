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
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Heading,
  Tag,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { authorise, login, getOptionChain } from "./api";
import init, {
  get_credit_spreads,
} from "../public/wasm/pkg/rupeetrader_wasm.js";

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
  const [strategies, setStrategies] = useState([]);

  const handleAuthorise = async () => {
    await authorise(clientId, redirectUrl);
  };

  const handleLogin = async () => {
    const accessToken = await login(code, clientId, apiSecret, redirectUrl);
    setAccessToken(accessToken);
  };

  const scan = async () => {
    await init();
    const instrumentKey = "NSE_INDEX%7CNifty%2050";
    const optionChain = await getOptionChain(
      instrumentKey,
      "2024-09-05",
      accessToken,
    );
    if (optionChain.status === "success") {
      const optionChainData = optionChain.data;

      // Convert the optionChainData to a JSON string
      const optionChainJson = JSON.stringify(optionChainData);

      // Call the Rust function with the JSON string

      const credit_spread_strategies =
        await get_credit_spreads(optionChainJson);
      const credit_spread_strategies_json = JSON.parse(
        credit_spread_strategies,
      );
      setStrategies(credit_spread_strategies_json);
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
    <div>
      <Tabs>
        <TabList>
          <Tab>Login</Tab>
          <Tab>Screener</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Container maxW="xl">
              <Stack spacing={3}>
                <div>
                  <FormLabel>{CLIENT_ID}</FormLabel>
                  <Input
                    value={clientId}
                    onChange={(event) => setClientId(event.target.value)}
                    placeholder={CLIENT_ID}
                    size="sm"
                  />
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
                <Button colorScheme="blue" onClick={() => handleAuthorise()}>
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
                <Button colorScheme="blue" onClick={() => handleLogin()}>
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
            </Container>
          </TabPanel>
          <TabPanel>
            <Heading as="h2" size="2xl">
              Bear Call Spread
            </Heading>
            <Button colorScheme="blue" onClick={scan}>
              Scan
            </Button>
            <TableContainer>
              <Table variant="simple">
                <TableCaption>
                  Imperial to metric conversion factors
                </TableCaption>
                <Thead>
                  <Tr>
                    <Th>Strike</Th>
                    <Th isNumeric>Max Profit</Th>
                    <Th isNumeric>Max Loss</Th>
                    <Th isNumeric>Breakeven</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Strategies strategies={strategies} />
                </Tbody>
              </Table>
            </TableContainer>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}

const Strategies = ({ strategies }) => {
  console.log(strategies);
  return strategies.map((strategy, i) => {
    return (
      <Tr key={i}>
        <Td>
          <Tag style={{ marginBottom: 1 }} colorScheme={"red"}>
            S
          </Tag>{" "}
          {strategy.sell_strike}
          <div style={{ marginTop: 3 }}>
            <Tag colorScheme={"green"}>B</Tag> {strategy.buy_strike}
          </div>
        </Td>
        <Td isNumeric>{strategy.max_profit}</Td>
        <Td isNumeric>{strategy.max_loss}</Td>
        <Td isNumeric>{strategy.breakeven}</Td>
      </Tr>
    );
  });
};
