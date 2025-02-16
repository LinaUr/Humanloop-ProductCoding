import { memo, useState } from "react";
import "./App.css";
import { Button, Text } from "@chakra-ui/react";

export const App = memo(() => {
  const [count, setCount] = useState(0);

  return (
    <>
      <Button onClick={() => setCount((prev) => prev + 1)}>Click me</Button>
      <Text>Count: {count}</Text>
    </>
  );
});
