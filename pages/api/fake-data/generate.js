import { getAuth } from "@clerk/nextjs/server";
import { faker } from '@faker-js/faker';

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { userId } = getAuth(req);

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const fakeData = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        country: faker.location.country(),
      };

      res.status(200).json(fakeData);
    } catch (error) {
      console.error("Error generating fake data:", error);
      res.status(500).json({ error: "Failed to generate fake data" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}