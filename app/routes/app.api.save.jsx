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
    announcements,
  });
}

export async function action({ request }) {
  try {
    // Authenticate Shopify Admin
    const { admin } = await authenticate.admin(request);

    // Connect MongoDB
    await connectDB();

    // Read request body
    const body = await request.json();

    console.log("=================================");
    console.log("BODY:", body);
    console.log("TEXT:", body.text);
    console.log("=================================");

    // Save to MongoDB
    const announcement = await Announcement.create({
      text: body.text,
    });

    // Save to Shopify Shop Metafield
 const response = await admin.graphql(
  `#graphql
  mutation SetAnnouncement($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields {
        id
        namespace
        key
        value
      }
      userErrors {
        field
        message
      }
    }
  }`,
  {
    variables: {
      metafields: [
        {
          ownerId: "gid://shopify/Shop/79247212743",
          namespace: "my_app",
          key: "announcement",
          type: "single_line_text_field",
          value: body.text,
        },
      ],
    },
  }
);

const result = await response.json();

console.log("SHOPIFY METAFIELD RESPONSE");
console.log(JSON.stringify(result, null, 2));

    return data({
      success: true,
      announcement,
      shopify: result,
    });
  } catch (error) {
    console.error("❌ Save Error:");
    console.error(error);

    return data(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
