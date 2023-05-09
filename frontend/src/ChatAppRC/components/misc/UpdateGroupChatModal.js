import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import UserBadgeItem from "./../userAvatar/UserBadgeItem";
import axios from "axios";
import UserListItem from "./../userAvatar/UserListItem";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { selectedChat, setSelectedChat, user } = ChatState();

  const handleRemove = async (u) => {
    //console.log(user);
    if (selectedChat.groupAdmin._id !== user._id && u._id !== user._id) {
      toast({
        title: "Only admin can remove someone",
        duration: 5000,
        isClosable: true,
        status: "error",
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);

      const config = { headers: { Authorization: "Bearer " + user.token } };

      const { data } = await axios.put(
        "/chat/groupremove",
        { chatId: selectedChat._id, userId: u._id },
        config
      );

      //console.log(data);

      u._id === user._id ? setSelectedChat() : setSelectedChat(data);

      setFetchAgain(!fetchAgain);

      setLoading(false);
    } catch (error) {
      //console.log(error);
      toast({
        title: error.response.data.message,
        duration: 5000,
        isClosable: true,
        status: "error",
        position: "bottom",
      });
    }
  };

  const handleRename = async () => {
    if (!groupChatName) {
      return;
    }
    try {
      setRenameLoading(true);
      const config = { headers: { Authorization: "Bearer " + user.token } };

      const { data } = await axios.put(
        "/chat/rename",
        { chatId: selectedChat._id, chatName: groupChatName },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast({
        title: error.response.data.message,
        duration: 5000,
        isClosable: true,
        status: "error",
        position: "bottom",
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleSearch = async (q) => {
    setSearch(q);
    if (!q) {
      return;
    }
    try {
      setLoading(true);
      const config = { headers: { Authorization: "Bearer " + user.token } };

      const { data } = await axios.get("/user?search=" + search, config);

      setSearchResult(data);

      setLoading(false);
    } catch (error) {
      toast({
        title: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const handleAddUser = async (u) => {
    if (selectedChat.users.find((user) => user._id === u._id)) {
      toast({
        title: "User already in the group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admins can add someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);

      const config = { headers: { Authorization: "Bearer " + user.token } };

      const { data } = await axios.put(
        "/chat/groupadd",
        { chatId: selectedChat._id, userId: u._id },
        config
      );

      setSelectedChat(data);

      setFetchAgain(!fetchAgain);

      fetchMessages();

      setSearch("");
      setSearchResult([]);

      setLoading(false);
    } catch (error) {
      toast({
        title: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={"center"}
          >
            {selectedChat?.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w={"100%"} display={"flex"} flexWrap={"wrap"} pb={3}>
              {selectedChat?.users.map((u, i) => (
                <UserBadgeItem
                  key={i}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl display={"flex"}>
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant={"solid"}
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Friends to Group"
                mb={1}
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <>
                <Spinner size={"lg"} />
              </>
            ) : (
              searchResult?.map((user, i) => (
                <UserListItem
                  key={i}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
