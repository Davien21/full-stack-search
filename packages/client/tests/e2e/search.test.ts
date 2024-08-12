import { API_BASE_URL } from "@/utils/helpers";
import { faker } from "@faker-js/faker";
import { test as base, expect } from "@playwright/test";
import axios from "axios";
import { ISuccessResponse } from "interfaces";

interface ICity {
  _id: string;
  name: string;
}

interface IFixtures {
  insertNewCity: (city: string) => Promise<ICity>;
}

const randomWord = faker.word.sample();

const test = base.extend<IFixtures>({
  // eslint-disable-next-line no-empty-pattern
  insertNewCity: async ({}, use) => {
    const city = randomWord;
    let id: string | undefined = undefined;
    await use(async () => {
      const response = await axios.post<ISuccessResponse<ICity>>(
        `${API_BASE_URL}/cities`,
        { name: city }
      );
      id = response.data.data._id;
      return response.data.data;
    });
    // Cleanup
    await axios.delete(`${API_BASE_URL}/cities/${id}`);
  },
});

test("Search for a city from home page", async ({ page, insertNewCity }) => {
  const newCity = await insertNewCity(randomWord);

  await page.goto("/");

  await expect(page).toHaveTitle("Accommodation Search");

  await page
    .getByRole("textbox", {
      name: /Search for accommodation/i,
    })
    .fill(newCity.name);

  const link = page.getByRole("link", { name: newCity.name });

  await expect(link).toBeVisible();

  await link.click();

  await expect(page).toHaveURL(`/cities/${newCity._id}`);
});
