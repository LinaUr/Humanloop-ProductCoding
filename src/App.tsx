import { memo, useCallback, useMemo, useState } from "react";
import "./App.css";
import { Box, Button, Textarea, Text, Flex } from "@mantine/core";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

type Message = {
  role: "developer" | "assistant" | "user";
  content: string;
};

export const App = memo(() => {
  const [textInput, setTextInput] = useState("");

  const [history, setHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = useCallback(() => {
    setIsLoading(true);
    setHistory((prev) => [...prev, { role: "user", content: textInput }]);
    openai.chat.completions
      .create({
        model: "gpt-4o",
        messages: [
          {
            role: "developer",
            content:
              "You are a patient language tutor for German. Please correct mistake that are made, and give explanations on why it's wrong and how it's correct. Then respond to the message provided to keep the conversation going.",
          },
          ...history,
          {
            role: "user",
            content: textInput,
          },
        ],
        store: true,
      })
      .then((res) => {
        const message = res.choices[0].message as Message;
        setHistory((prev) => [
          ...prev,
          { role: message.role, content: message.content },
        ]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [textInput]);

  const messageDisplays = useMemo(() => {
    return history.map((message) => {
      return (
        <Box
          p="md"
          style={{ borderRadius: "1rem" }}
          bg={message.role === "user" ? "gray.6" : "gray.2"}
          ta={message.role === "user" ? "right" : "left"}
          w="fit-content"
          maw="80%"
          ml={message.role === "user" ? "auto" : 0}
        >
          <Text key={message.content}>{message.content}</Text>
        </Box>
      );
    });
  }, [history]);

  return (
    <Flex h="100%" w="100%" gap="md" direction="column">
      <Flex
        gap="md"
        direction="column"
        style={{ overflow: "auto", flexGrow: 1 }}
      >
        {messageDisplays}
      </Flex>
      <Flex w="100%" gap="md" align="center">
        <Textarea
          value={textInput}
          placeholder="Write something..."
          onChange={(e) => setTextInput(e.target.value)}
          w="80%"
          minRows={3}
          maxRows={10}
          autosize
        />
        <Button onClick={onSubmit} disabled={isLoading}>
          {isLoading ? "Sending..." : "Send"}
        </Button>
      </Flex>
    </Flex>
  );
});
