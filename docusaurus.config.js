// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'AutoGen 多代理会话框架',
  tagline: 'AutoGen 多代理',
  url: 'https://autogen.run',
  baseUrl: '/',
  onBrokenLinks: 'ignore',
  onBrokenMarkdownLinks: 'ignore',
  favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/liteli1987gmail/autogen/tree/main/docs/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/liteli1987gmail/autogen/tree/main/docs/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      prism: {
        theme: require("prism-react-renderer/themes/vsLight"),
        darkTheme: require("prism-react-renderer/themes/vsDark"),
      },
      image: "img/parrot-chainlink-icon.png",
      metadata: [
        { name: 'keywords', content: 'antogen,langchain,LLM,chatGPT,应用开发' },
        {
          name: 'description', content: 'AutoGen 中文文档，助力大语言模型LLM应用开发、chatGPT应用开发。'
        }],
      navbar: {
        title: "AutoGen 中文文档",
        // logo: {
        //   alt: 'AutoGen',
        //   src: 'img/ag.svg',
        // },
        items: [
          {
            type: 'doc',
            docId: 'Getting-Started',
            position: 'left',
            label: 'Docs',
          },
          {to: 'blog', label: 'Blog', position: 'left'},
          {
            type: 'doc',
            docId: 'FAQ',
            position: 'left',
            label: 'FAQ',
          },
          {
            href: 'https://github.com/liteli1987gmail/autogen',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: "light",
        links: [
          {
            title: "Community",
            items: [
              {
                label: "Langchain英文官网",
                href: "https://www.Langchain.com",
              },
              {
                label: "Langchain GitHub",
                href: "https://github.com/hwchase17/langchain",
              },
              {
                label: "LLM/GPT应用外包开发",
                href: "http://www.r-p-a.com/llm-gpt-kaifa/",
              }
            ],
          },
          {
            title: "LLM/GPT生态",
            items: [
              {
                label: "OpenAI 文档",
                href: "https://www.openaidoc.com.cn"
              },
              {
                label: "Milvus 文档",
                href: "https://www.milvus-io.com"
              },
              {
                label: "Pinecone 文档",
                href: "https://www.pinecone-io.com/"
              },
              {
                label: "AutoGen 中文文档",
                href: "https://autogen.run"
              }
            ]
          },
          {
            title: "GitHub",
            items: [
              {
                label: "Python",
                href: "https://github.com/liteli1987gmail/autogen",
              },
            ],
          }
        ],
        // logo: {
        //   alt: 'LangChain中文网',
        //   // src: 'img/quncode.png',
        //   src:'https://pic1.zhimg.com/80/v2-31131dcb1732cb5bca7c182c9e8da046_r.jpg',
        //   width: 320,
        //   height: 380,
        // },
        // copyright: `Copyright © ${new Date().getFullYear()} LangChain中文网. 沪ICP备2023014280号-3`,
      },
    }),
};

module.exports = config;
