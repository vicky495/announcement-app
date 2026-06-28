import { useEffect, useState } from "react";
import {
  Page,
  Card,
  TextField,
  Button,
  BlockStack,
  Text,
} from "@shopify/polaris";

export default function Index() {
  const [announcement, setAnnouncement] = useState("");
  const [announcements, setAnnouncements] = useState([]);

  async function loadAnnouncements() {
    try {
      const response = await fetch("/app/api/announcements");
      const result = await response.json();

      if (result.success) {
        setAnnouncements(result.announcements);
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadAnnouncements();
  }, []);

  async function saveAnnouncement() {
    try {
      const response = await fetch("/app/api/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: announcement,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert("✅ Announcement Saved Successfully");
        setAnnouncement("");
        loadAnnouncements();
      } else {
        alert(result.message);
      }
    } catch (err) {
      console.error(err);
      alert("Server Error");
    }
  }

  return (
    <Page title="📢 Announcement Dashboard">

      <BlockStack gap="500">

        <Card>
          <BlockStack gap="400">

            <Text variant="headingMd" as="h2">
              Create Announcement
            </Text>

            <TextField
              label="Announcement Text"
              multiline={4}
              autoComplete="off"
              value={announcement}
              onChange={setAnnouncement}
            />

            <Button
              variant="primary"
              onClick={saveAnnouncement}
            >
              Save Announcement
            </Button>

          </BlockStack>
        </Card>

        <Card>
          <BlockStack gap="400">

            <Text variant="headingMd" as="h2">
              Saved Announcements
            </Text>

            {announcements.length === 0 ? (
              <Text>No announcements found.</Text>
            ) : (
              announcements.map((item) => (
                <Card key={item._id}>
                  <BlockStack gap="200">

                    <Text variant="bodyLg" as="p" fontWeight="bold">
                      {item.text}
                    </Text>

                    <Text tone="subdued" as="p">
                      {new Date(item.createdAt).toLocaleString()}
                    </Text>

                  </BlockStack>
                </Card>
              ))
            )}

          </BlockStack>
        </Card>

      </BlockStack>

    </Page>
  );
}
