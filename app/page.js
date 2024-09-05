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
  Card,
  Tr,
  Th,
  Td,
  TableContainer,
  Tag,
  Select,
  Highlight,
  Heading,
  SimpleGrid,
  Switch,
  useToast,
  FormControl,
  Tooltip,
  Alert,
  AlertIcon,
  AlertDescription,
  Box,
  CardBody,
  Text,
} from "@chakra-ui/react";
import { QuestionIcon } from "@chakra-ui/icons";
import {
  differenceInDays,
  isBefore,
  isToday,
  isAfter,
  parseISO,
  startOfDay,
} from "date-fns";
import { useState, useEffect } from "react";
import { authorise, login, getOptionChain } from "./api";
import init, {
  bear_call_spread,
  bull_put_spread,
} from "../public/wasm/pkg/rupeetrader_wasm.js";
import Image from "next/image";

export default function Home() {
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
  // select INSTRUMENT and STRATEGY
  const [instrument, setInstrument] = useState("");
  const [strategy, setStrategy] = useState("");
  const toast = useToast();
  const [bidAskSpread, setBidAskSpread] = useState(false);
  const [riskRewardRatio, setRiskRewardRatio] = useState(false);

  const handleBidAskSpread = () => {
    setBidAskSpread(!bidAskSpread);
  };

  const handleRiskRewardRatio = () => {
    setRiskRewardRatio(!riskRewardRatio);
  };

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

  const daysToExpiry = (expiryDate) => {
    const targetDate = new Date(expiryDate);
    const currentDate = new Date();
    const daysLeft = differenceInDays(targetDate, currentDate);
    return daysLeft;
  };

  const instruments = {
    NIFTY: "NSE_INDEX%7CNifty%2050",
    BANK_NIFTY: "NSE_INDEX%7CNifty%20Bank",
  };
  const allStrategies = {
    BEAR_CALL_SPREAD: "BEAR_CALL_SPREAD",
    BULL_PUT_SPREAD: "BULL_PUT_SPREAD",
  };

  const scan = async () => {
    if (instrument === "" || strategy === "") {
      toast({
        title: "Instrument & strategy not selected",
        description: "Please select instrument and strategy.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } else {
      let expiries;
      await init();
      if (instrument === instruments.NIFTY) {
        expiries = ["2024-09-12", "2024-09-19", "2024-09-26"];
      } else if (instrument === instruments.BANK_NIFTY) {
        expiries = ["2024-09-11", "2024-09-18", "2024-09-25"];
      }

      const now = new Date();
      const timeCutoff = new Date().setHours(15, 30, 0, 0);

      const promises = expiries
        .filter((expiry) => {
          const expiryDate = parseISO(expiry);

          // Exclude dates before today
          if (isBefore(expiryDate, startOfDay(now))) {
            return false;
          }

          // Exclude today's date if it's after 3:30 PM
          if (isToday(expiryDate) && isAfter(now, timeCutoff)) {
            return false;
          }

          return true;
        })
        .map(async (expiry) => {
          try {
            const optionChain = await getOptionChain(
              instrument,
              expiry,
              accessToken,
            );

            // Check if the API call was successful
            if (optionChain.status !== "success") {
              throw new Error(`API call failed for expiry: ${expiry}`);
            }

            const optionChainJson = {
              optionchain: JSON.stringify(optionChain.data),
              bid_ask_spread: bidAskSpread,
              risk_reward_ratio: riskRewardRatio,
            };

            if (strategy === allStrategies.BEAR_CALL_SPREAD) {
              const list_strategies = bear_call_spread(optionChainJson);
              const list_strategies_json = JSON.parse(list_strategies);
              return {
                daysToExpiry: daysToExpiry(expiry),
                strategies: list_strategies_json,
              };
            } else if (strategy === allStrategies.BULL_PUT_SPREAD) {
              const list_strategies = bull_put_spread(optionChainJson);
              const list_strategies_json = JSON.parse(list_strategies);
              return {
                daysToExpiry: daysToExpiry(expiry),
                strategies: list_strategies_json,
              };
            }

            // Return a default value if the strategy doesn't match
            return {
              daysToExpiry: daysToExpiry(expiry),
              strategies: [],
            };
          } catch (error) {
            // If an error occurs, throw it to handle it in Promise.all
            throw new Error(
              `Failed to fetch data for expiry: ${expiry} - ${error.message}`,
            );
          }
        });

      Promise.all(promises)
        .then((finalResult) => {
          setStrategies(finalResult);
        })
        .catch((error) => {
          console.error(
            "An error occurred while fetching data:",
            error.message,
          );
          // Handle the error as needed (e.g., show a notification)
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

  const handleInstrument = (event) => {
    setInstrument(event.target.value);
  };

  const handleStrategy = (event) => {
    setStrategy(event.target.value);
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
            <Login
              clientId={clientId}
              setClientId={setClientId}
              apiSecret={apiSecret}
              setApiSecret={setApiSecret}
              redirectUrl={redirectUrl}
              setRedirectUrl={setRedirectUrl}
              code={code}
              setCode={setCode}
              accessToken={accessToken}
              setAccessToken={setAccessToken}
              handleAuthorise={handleAuthorise}
              handleLogin={handleLogin}
              save={save}
            />
          </TabPanel>
          <TabPanel>
            <Container maxW="md">
              <Stack spacing={3}>
                <Select
                  placeholder="Select instrument"
                  value={instrument}
                  onChange={handleInstrument}
                >
                  <option value={instruments.NIFTY}>NIFTY 50</option>
                  <option value={instruments.BANK_NIFTY}>BANK NIFTY</option>
                </Select>
                <Select
                  placeholder="Select strategy"
                  value={strategy}
                  onChange={handleStrategy}
                >
                  <option value={allStrategies.BEAR_CALL_SPREAD}>
                    Bear Call Spread
                  </option>
                  <option value={allStrategies.BULL_PUT_SPREAD}>
                    Bull Put Spread
                  </option>
                </Select>

                <FormControl as={SimpleGrid} columns={{ base: 3, lg: 2 }}>
                  <FormLabel htmlFor="isChecked">
                    Bid-ask spread &nbsp;
                    <Tooltip label="bid ask spread not wider than ₹2">
                      <QuestionIcon />
                    </Tooltip>
                  </FormLabel>
                  <Switch
                    id="bid-ask-switch"
                    isChecked={bidAskSpread}
                    onChange={handleBidAskSpread}
                  />
                  <FormLabel htmlFor="isChecked">
                    Risk-reward ratio &nbsp;
                    <Tooltip label="max loss is not more than 3 times of max profit">
                      <QuestionIcon />
                    </Tooltip>
                  </FormLabel>
                  <Switch
                    id="risk-reward-ratio-switch"
                    isChecked={riskRewardRatio}
                    onChange={handleRiskRewardRatio}
                  />
                </FormControl>

                <Button colorScheme="blue" onClick={scan}>
                  Scan
                </Button>
              </Stack>
            </Container>

            <SimpleGrid style={{ marginTop: 20 }} columns={3} spacing={30}>
              <Expiries strategies={strategies} />
            </SimpleGrid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}

const Login = ({
  clientId,
  setClientId,
  apiSecret,
  setApiSecret,
  redirectUrl,
  setRedirectUrl,
  code,
  setCode,
  accessToken,
  setAccessToken,
  handleAuthorise,
  handleLogin,
  save,
}) => {
  return (
    <Container maxW="xl">
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
              <Text pt="2" fontSize="md">
                Create an{" "}
                <b
                  onClick={() =>
                    window.open("https://account.upstox.com/developer/apps")
                  }
                >
                  <u>Upstox App</u>
                </b>
              </Text>
              <Image
                src="/my-apps.png"
                width={500}
                height={500}
                alt="my apps in upstox"
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
  );
};

const Expiries = ({ strategies = [] }) => {
  return strategies.map((strategy, i) => {
    const daysToExpiry = strategy.daysToExpiry;
    return (
      <div key={i}>
        <DaysToExpiry daysToExpiry={daysToExpiry} />
        <Card style={{ marginTop: 10, marginBottom: 10 }}>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Strike</Th>
                  <Th isNumeric>Max Profit</Th>
                  <Th isNumeric>Max Loss</Th>
                  <Th isNumeric>Breakeven</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Strategies strategies={strategy.strategies} />
              </Tbody>
            </Table>
          </TableContainer>
        </Card>
      </div>
    );
  });
};

const DaysToExpiry = ({ daysToExpiry }) => {
  const numberOfDays = daysToExpiry.toString();
  if (daysToExpiry === 0 || daysToExpiry === 1) {
    return (
      <Heading lineHeight="tall">
        <Highlight
          query={`${numberOfDays} Day`}
          styles={{ px: "2", py: "1", rounded: "full", bg: "teal.100" }}
        >
          {`${numberOfDays} Day to expiry`}
        </Highlight>
      </Heading>
    );
  } else {
    return (
      <Heading lineHeight="tall">
        <Highlight
          query={`${numberOfDays} Days`}
          styles={{ px: "2", py: "1", rounded: "full", bg: "teal.100" }}
        >
          {`${numberOfDays} Days to expiry`}
        </Highlight>
      </Heading>
    );
  }
};

const Strategies = ({ strategies = [] }) => {
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
