import { ActionIcon, Group, Popover, Stack, TextInput } from "@mantine/core";
import { getHotkeyHandler } from "@mantine/hooks";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MoodHappy, Send } from "tabler-icons-react";
import { height } from '@mui/system';
import { useMutation, useSubscription } from "@apollo/client";
import { ADD_MESSAGE, MESSAGE_ADDED_SUBSCRIPTION } from "../query/query";

const ChatBox = ({ uuid, refetch, login }: any) => {
  const [value, setValue] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);

  const [addMessage] = useMutation(ADD_MESSAGE, {
    onCompleted: () => {
      refetch();
    },
  });

  function sendMsg() {
    addMessage({ variables: { newMessage: { chatUUID: uuid, userID: login, message: value } } });
    setValue('');

  }


  const { data: newMessageData, loading: newMessageLoading } = useSubscription(MESSAGE_ADDED_SUBSCRIPTION, {
    variables: { uuid },
  });

  useEffect(() => {
    if (newMessageData) {
      refetch();
    }
  }, [newMessageData]);

  return (
    <Stack sx={{ height: "8vh", bottom: 0, position: 'absolute' }} justify="center" p={0}>
      <Group position="right">

        <TextInput
          onKeyDown={(e) => {
            if (e.keyCode === 13)
              sendMsg();
          }
          }
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
          sx={{ flexGrow: 1 }}
          placeholder="Say something nice . . . "
        />
        <ActionIcon
          variant="outline"
          size="lg"
          onClick={() => sendMsg()}
          disabled={
            !/\S/.test(value) ? true : value.length < 2 ? true : false
          }
        >
          <Send />
        </ActionIcon>
      </Group>
    </Stack>
  );
};

export default ChatBox;