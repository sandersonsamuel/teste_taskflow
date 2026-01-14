import { app } from "./app";

const port = process.env.PORT

app.listen({
  port: Number(port),
  host: '0.0.0.0'

}).then(() => {
  console.log(`HTTP server running on http://localhost:${port}`);
  console.log(`API Reference running on http://localhost:${port}/docs`);
})