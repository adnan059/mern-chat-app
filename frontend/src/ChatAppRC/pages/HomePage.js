import React, { useEffect } from "react";
import Login from "../components/auth/Login";
import Signup from "../components/auth/Signup";
import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) {
      navigate("/chats");
    }
  }, [navigate]);

  return (
    <>
      <Container
        bg="blue.200"
        maxW={`xl`}
        centerContent
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Box
          display={"flex"}
          justifyContent="center"
          p={3}
          bg={"white"}
          w={"100%"}
          m={"40px 0 15px 0"}
          borderRadius={"lg"}
          borderWidth={"1px"}
        >
          <Text fontSize={"4xl"} fontFamily={"Work sans"}>
            TalkEpoch
          </Text>
        </Box>

        <Box
          bg={"white"}
          w={"100%"}
          p={4}
          borderRadius={"lg"}
          borderWidth={"1px"}
        >
          <Tabs variant={"soft-rounded"}>
            <TabList mb={"1em"}>
              <Tab width={"50%"}>Login</Tab>
              <Tab width={"50%"}>Signup</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login />
              </TabPanel>
              <TabPanel>
                <Signup />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </>
  );
};

export default HomePage;
