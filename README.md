# 🚀 YAE Backend

> ⚡ Fast. Secure. Bun-powered. Built for performance with unmatched DX.

---

## 🎯 Core Concept
A backend foundation that can be deployed to **any provider** — with **no vendor, platform, or database lock-in**.

---

## 🌟 Overview

**YAE Backend** is the powerhouse behind your AI VTuber companion. Built with Bun for blazing-fast performance, this backend handles all the heavy lifting — from API routes to audio processing — while keeping developer experience at its core.


---

## ✨ Features

- ⚡ **Bun Runtime** — Lightning-fast JavaScript/TypeScript execution
- 🐳 **Docker-Ready** — One-command deployment to any platform
- 🔒 **Security-First** — Built with best practices from the ground up
- 🎯 **Developer Experience** — Clean code, clear docs, quick setup

---

## 💻 Installation

### Prerequisites

| Tool       | Description                        | Installation                                      |
| ---------- | ---------------------------------- | ------------------------------------------------- |
| **Bun**    | JavaScript runtime & toolkit       | [Install Bun](https://bun.sh/docs/installation)   |
| **Git**    | Version control                    | [Install Git](https://git-scm.com/downloads)      |
| **Docker** | Container deployment               | [Get Docker](https://docs.docker.com/get-docker/) |
| **Bruno**  | Local-first, Git-native API client | [Bruno](https://www.usebruno.com/)                |

### Quick Start

```bash
# Clone the repository
git clone https://github.com/OuOSama/YAE-BACKEND.git backend

# Navigate to project folder
cd backend

# Install dependencies (it's literally that fast)
bun install

# Start development server
bun run dev
```

That's it! Your backend is now running. We're so back. 🎯

---

## 📂 Project Structure

```
backend/
├── docs/
│   └── systems/          # System-specific documentation
├── src/
│   ├── modules/          # API endpoints, Business logic
│   ├── types/            # Types
│   ├── app.ts            # Entry point
│   └── index.ts          # Cluster mode
├── Dockerfile            # Container configuration
├── package.json          # Bun dependencies
└── README.md             # You are here!
```

---

## 📚 Documentation

Detailed documentation for each system is available in the `docs` folder:

### 📖 Available Docs

- 🔌 [API Reference](./docs/bruno/) — API endpoint documentation
- 💻 [Systems](./docs/systems/)     — System architecture & README
- 📚 [Resources](./docs/resources/) — Shared resources & references

> 💡 **Tip**: Start with the system docs that match your use case!

---

## 🐳 Deployment

Deploy to your favorite platforms with ease using our included Dockerfile.

### Popular Platforms

| Platform       | Guide                                                                                       | Best For                    |
| -------------- | ------------------------------------------------------------------------------------------- | --------------------------- |
| 🚂 **Railway** | [Docker Guide](https://docs.railway.com/reference/dockerfiles)                              | Quick deploys, auto-scaling |
| ⚡ **Render**  | [Docker Guide](https://render.com/docs/docker)                                              | Free tier, simple setup     |
| 🌊 **Fly.io**  | [Deploy Guide](https://fly.io/docs/languages-and-frameworks/dockerfile/)                    | Edge deployment, global     |
| ☁️ **AWS**     | [ECS Guide](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/docker-basics.html) | Enterprise, scalability     |

### Docker Deployment

```bash
# Build the image
docker build -t yae-backend .

# Run the container
docker run -p 3001:3001 yae-backend

```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3001
NODE_ENV=production

# vLLM endpoint for our LLM & EMB
VLLM_LLM_URL    = http://localhost:8000/v1
VLLM_EMB_URL    = http://localhost:8001/v1

```

---

## 🛠️ Development

### Available Scripts

```bash
# Start development server with hot reload
bun run dev

# Run tests
bun test

# Lint & Format code
bun run check

```

### Testing

```bash
# Run all tests
bun test

```

---

## 🌈 Roadmap

- [ ] Redis caching layer
- [ ] GraphQL API option
- [ ] Rate limiting middleware
- [ ] Automated CI/CD pipelines
- [ ] Performance monitoring dashboard
- [ ] Multi-language support
- [ ] Web Dashboard management (Next.Js) YAE-Dashboard?

---

## 🤝 Contributing

We'd love your contributions to make YAE Backend even more powerful!

### How to Contribute

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Contribution Guidelines

- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Keep commits atomic and meaningful

---

## 🐛 Troubleshooting

### Common Issues

**Issue**: Bun installation fails

- **Fix**: Make sure you're on a supported platform (macOS, Linux, WSL2)
- **Fix**: Try the manual installation method from [bun.sh](https://bun.sh)

**Issue**: Port already in use

- **Fix**: Change the `PORT` in your `.env.local` / `.env` file
- **Fix**: Kill the process using the port: `lsof -ti:3001 | xargs kill`

**Issue**: Docker build fails

- **Fix**: Ensure Docker daemon is running
- **Fix**: Check Dockerfile syntax and build context

---

## 💖 Acknowledgments

Built with love and powered by amazing open-source projects:

- [Bun](https://bun.sh) — The all-in-one JavaScript runtime
- [Lavalink](https://github.com/lavalink-devs/Lavalink) — Audio delivery for Discord
- [n8n](https://n8n.io) — Workflow automation platform
- The VTuber dev community for endless inspiration ✨

---

## 📝 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

You're free to use, modify, and distribute this project. Just don't be cringe about it. 💜

---

## 🦊 Credits

**Created with 💜 by [OuOSama](https://github.com/OuOSama)**

Part of the YAE-AI ecosystem:

- [YAE-AI](https://github.com/OuOSama/YAE-AI) — Frontend AI VTuber framework
- [YAE-BACKEND](https://github.com/OuOSama/YAE-BACKEND) — You are here!
- [YAE-BOT](https://github.com/OuOSama/YAE-BOT) — Yae Discord Bot

---

<div align="center">

**Made with 💜 for the VTuber and developer community**

_Stay based, stay creative_ ✨

**[Star the Repo](https://github.com/OuOSama/YAE-BACKEND)** • **[Report Bug](https://github.com/OuOSama/YAE-BACKEND/issues)** • **[Request Feature](https://github.com/OuOSama/YAE-BACKEND/discussions)**

</div>
