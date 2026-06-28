import { data } from "react-router";
import { authenticate } from "../shopify.server";
import { connectDB } from "../db/mongodb";
import Announcement from "../models/Announcement";

export async function loader({ request }) {
  await authenticate.admin(request);

  await connectDB();

  const announcements = await Announcement.find().sort({
    createdAt: -1,
  });

  return data({
    success: true,
    announcements,
  });
}
