import { defineConfig } from 'astro/config';
import robotsTxt from 'astro-robots-txt';
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import webmanifest from "astro-webmanifest";
import compress from "astro-compress";

// https://astro.build/config
export default defineConfig({
  site: "https://sylvia-castro.com",
  integrations: [robotsTxt(), sitemap(), tailwind(), webmanifest({
    name: 'Sylvia Castro: Spanish Interpreter/Translator',
    icon: 'public/sylvia-castro-logo.png',
    description: 'Sylvia Castro is a Spanish Interpreter/Translator based out of San Diego, CA with over 20 years experience.',
    start_url: '/',
  }), compress(),],
});
