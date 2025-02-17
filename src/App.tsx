import { memo, useState } from "react";
import "./App.css";
import { Button, Text, MantineProvider } from "@mantine/core";

export const App = memo(() => {
  const [count, setCount] = useState(0);

  return (
    <MantineProvider defaultColorScheme="light">
      <Button onClick={() => setCount((prev) => prev + 1)}>Click me</Button>
      <Text>Count: {count}</Text>
    </MantineProvider>
  );
});
