

<div align="center">

<a href="https://github.com/zhiyu1998/rrorange-and-friends-weekly" target="blank">
  <img src="./docs/public/favicon-512x512.png" height="100px" alt="logo" style="border-radius: 20px"/>
</a>

# 《RrOrange And Friends Weekly》

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![VitePress](https://img.shields.io/badge/VitePress-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Vue-3](https://img.shields.io/badge/Vue-3-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![TDesign](https://img.shields.io/badge/TDesign-0052CC?style=for-the-badge&logo=tdesign&logoColor=white)
![Cloudflare Pages](https://img.shields.io/badge/Cloudflare%20Pages-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)
![Giscus](https://img.shields.io/badge/Giscus-181717?style=for-the-badge&logo=github&logoColor=white)
![Support RSS](https://img.shields.io/badge/Support%20RSS-FFA500?style=for-the-badge&logo=rss&logoColor=white)
![Support I18N](https://img.shields.io/badge/Support%20I18N-0078D4?style=for-the-badge&logo=google-translate&logoColor=white)
![SEO](https://img.shields.io/badge/SEO-4285F4?style=for-the-badge&logo=google&logoColor=white)

[中文](./README.md) | **Enlish**

Record of fun websites, apps, resource sharing, and efficiency software tools encountered while surfing the internet each week.

The content is expected to be released on Saturdays or over the weekends if it's abundant and quick.

If inspiration runs dry, new content will be published based on circumstances. Feel free to star 🌟!

![](./images/demo.png)

</div>

## Features

- 🌓 Provides light and dark mode switching function to adapt to different reading environments.

- 📡 Offers RSS subscription feature, supporting updates in both Chinese and English content.

- 💬 Integrates Giscus comment system for user communication and feedback.

- 🖼️ Supports high-definition image previews to enhance visual experience.

- 📜 Allows customization of font settings to improve reading comfort.

- 🔍 Conducts SEO optimization including Sitemap generation, Twitter Card, and Open Graph tag support to increase search engine visibility.

## Development

```bash
yarn

yarn docs:dev
```

1. Modify the `giscus` configuration in `.vitepress/theme/components/Comments.vue`;

2. Modify the sidebar configuration, RSS configuration, metadata configuration, etc. in the `utils` folder;

3. Modify relevant configurations in the `config` folder, mainly title, description, etc.;

4. Change the content of articles in the `posts/**` and `en/posts/**` directories to your own content.

## Acknowledgements

Thanks to open source libraries for providing templates and tools for this weekly newsletter:

- [FAV0](https://github.com/Justin3go/FAV0)

## License

This repository is dual-licensed under MIT License and CC-BY-4.0 License:

- All `.md` files are licensed under CC-BY-4.0 License; you must retain attribution rights.

- Other code files are licensed under MIT License; you can use them freely.

Please refer to the [LICENSE](./LICENSE) file for more details.