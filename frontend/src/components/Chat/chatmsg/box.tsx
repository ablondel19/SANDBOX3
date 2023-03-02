import { ActionIcon, Group, Popover, Stack, TextInput } from "@mantine/core";
import { getHotkeyHandler } from "@mantine/hooks";
import EmojiPicker from "emoji-picker-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { MoodHappy, Send } from "tabler-icons-react";
import { height } from '@mui/system';
import { useMutation } from "@apollo/client";
import { ADD_MESSAGE } from "../query/query";
import useEffect from 'react';

const ChatBox = ({ ... props}) => {
  const { uuid, refetch, login } = props;
  const [value, setValue] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);

  // mutation
  const [addMessage] = useMutation(ADD_MESSAGE);

  function sendMsg() {
    addMessage({
      variables: {
        newMessage: {
          chatUUID: uuid,
          userID: login,
          message: value
        }
      }
    }).then(() => {
      setValue('');
    }).catch((err) => {
      return;
    })
  }

  return (
    <Stack sx={{ height: "8vh", bottom: -10, position: 'absolute' }} justify="center">
      <Group position="right">
        <TextInput
          onKeyDown={(e) => {
            if (e.key === 'Enter')
              sendMsg();
          }
          }
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
          sx={{ flexGrow: 1 }}
          placeholder="Say something nice . . . "
          rightSection={
            <ActionIcon
              onClick={() =>
                setShowEmoji(true)
              }
            >
              <MoodHappy />
            </ActionIcon>
          }
        />
        <ActionIcon
          variant="outline"
          size="lg"
          onClick={() => sendMsg()}
          disabled={
            !/\S/.test(value) ? true : value.length < 1 ? true : false
          }
        >
          <Send />
        </ActionIcon>
      </Group>
    </Stack>
  );
};

export default ChatBox;