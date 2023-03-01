import {
    Avatar,
    Group,
    Paper,
    Text,
  } from "@mantine/core";

export const NavbarChat = ({login, avatar} : any) => {

    return (
        <Paper

          radius={5}
          sx={{
            boxShadow: "0px 2px 0px 0px rgba(173,181,189,.5)",
            height: 60,
          }}
          style={{
            maxWidth: 200,
          }}
        >
          <Group
            p="sm"
            align="center"
          >
              <Avatar
                src={`data:image/jpeg;base64,${avatar}`}
                radius="xl"
              />
            <Text>{login}</Text>
      
          </Group>
        </Paper>
    )
}