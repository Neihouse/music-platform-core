import {
  ActionIcon,
  Container,
  Group,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconCheck, IconEdit, IconX } from "@tabler/icons-react";
import * as React from "react";

export interface IToggleEditTextProps {
  text: string;
  variant: "text" | "title";
  onEdit: (text: string) => void;
}

export function ToggleEditText({
  text,
  variant,
  onEdit,
}: IToggleEditTextProps) {
  const [editing, setEditing] = React.useState<boolean>(false);
  const [newText, setNewText] = React.useState<string>(text);

  return (
    <>
      {!editing ? (
        <Group>
          {variant === "text" ? <Text>{text}</Text> : <Title>{text}</Title>}
          <ActionIcon onClick={() => setEditing(true)}>
            <IconEdit />
          </ActionIcon>
        </Group>
      ) : (
        <Group>
          <TextInput
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
          />
          <ActionIcon
            onClick={() => {
              onEdit(newText);
              setEditing(false);
            }}
          >
            <IconCheck />
          </ActionIcon>
          <ActionIcon onClick={() => setEditing(false)}>
            <IconX />
          </ActionIcon>
        </Group>
      )}
    </>
  );
}
