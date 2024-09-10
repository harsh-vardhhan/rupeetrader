// filter.js
"use client";
import {
  Container,
  FormLabel,
  Stack,
  Button,
  Select,
  SimpleGrid,
  Switch,
  FormControl,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { QuestionIcon } from "@chakra-ui/icons";
import { useState } from "react";

export default function Filter({
  instrument,
  strategy,
  instruments,
  allStrategies,
  handleInstrument,
  handleStrategy,
  handleBidAskSpread,
  handleRiskRewardRatio,
  handleBreakevenDistance,
  scan,
  bidAskSpread,
  riskRewardRatio,
  breakevenDistance,
}) {
  const toast = useToast();

  return (
    <Container maxW="md" style={{ marginTop: 10 }}>
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
          <option value={allStrategies.BULL_PUT_SPREAD}>Bull Put Spread</option>
        </Select>

        <FormControl as={SimpleGrid} columns={{ base: 2, lg: 2 }}>
          <FormLabel htmlFor="isChecked">
            Tight bid-ask spread &nbsp;
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
            Healthy risk-reward ratio &nbsp;
            <Tooltip label="max loss is not more than 3 times of max profit">
              <QuestionIcon />
            </Tooltip>
          </FormLabel>
          <Switch
            id="risk-reward-ratio-switch"
            isChecked={riskRewardRatio}
            onChange={handleRiskRewardRatio}
          />
          <FormLabel htmlFor="isChecked">
            Spot and breakeven distance &nbsp;
            <Tooltip label="Sort by distance between breakeven & spot price">
              <QuestionIcon />
            </Tooltip>
          </FormLabel>
          <Switch
            id="risk-reward-ratio-switch"
            isChecked={breakevenDistance}
            onChange={handleBreakevenDistance}
          />
        </FormControl>

        <Button colorScheme="blue" onClick={scan}>
          Scan
        </Button>
      </Stack>
    </Container>
  );
}
