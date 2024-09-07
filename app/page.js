"use client";
import Header from "./header";
import Image from "next/image";
import { Container, Heading, Box, Button } from "@chakra-ui/react";

export default function Home() {
  return (
    <div>
      <Header />
      <Container style={{ marginTop: 20 }} centerContent>
        <Heading as="h1" size="4xl" style={{ textAlign: "center" }}>
          Options strategy screener
        </Heading>
        <Heading as="h2" color="#718096">
          Pre calculated spread strategies
        </Heading>
        <Box
          style={{ marginTop: 20 }}
          borderWidth="3px"
          borderColor="#C6F6D5"
          padding="15px"
        >
          <Image
            src="/screener.png"
            style={{ marginTop: 20 }}
            alt="client id and api secret"
            width={400}
            height={400}
          />
        </Box>
      </Container>
      <Container style={{ marginTop: 20 }} centerContent>
        <Box borderWidth="3px" borderRadius="3px" padding="15px">
          <Heading mb={4}>100% free & open source</Heading>
          <a href="https://github.com/harsh-vardhhan/rupeetrader">
            <Button size="lg" colorScheme="green" mt="24px">
              Source Code
            </Button>
          </a>
        </Box>
      </Container>
    </div>
  );
}
