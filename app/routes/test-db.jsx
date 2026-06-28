import { data } from "react-router";
import { connectDB } from "../db/mongodb";

export async function loader() {
  await connectDB();

  return data({
    success: true,
    message: "MongoDB Connected",
  });
}
