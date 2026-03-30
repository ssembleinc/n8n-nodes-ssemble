# n8n-nodes-ssemble

This is an n8n community node. It lets you use [Ssemble AI Clipping](https://ssemble.com) in your n8n workflows to create AI-generated short-form video clips from YouTube videos.

Ssemble automatically finds the best moments in a video and creates TikTok/Reels/Shorts-style clips with captions, music, gameplay overlays, meme hooks, and viral scoring.

[n8n](https://n8n.io/) is a fair-code licensed workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

```
npm install n8n-nodes-ssemble
```

Or install via the n8n UI: **Settings > Community Nodes > Install > `n8n-nodes-ssemble`**

## Operations

### Short

| Operation | Description |
|-----------|-------------|
| **Create** | Submit a YouTube URL or file URL for AI clipping. Returns a request ID instantly. Processing takes 5-30 minutes. |
| **Get Results** | Retrieve all generated clips for a completed request, including video URLs, titles, viral scores, and durations. |

### Request

| Operation | Description |
|-----------|-------------|
| **Get Status** | Check the processing status and progress (0-100%) of a short creation request. |
| **Get Many** | List all short creation requests with optional status filtering and pagination. |
| **Delete** | Permanently delete a request and all generated videos. Credits are NOT refunded. |

### Asset

| Operation | Description |
|-----------|-------------|
| **List** | Browse available assets: caption templates (9+), music tracks (45+), gameplay overlays (30+), or meme hooks (159+). |

## Credentials

You need a Ssemble API key to use this node.

1. Go to [app.ssemble.com](https://app.ssemble.com)
2. Navigate to **Settings > API Keys**
3. Click **Generate New Key**
4. Copy the key (starts with `sk_ssemble_`)

## Compatibility

- Minimum n8n version: 1.0.0
- Node.js version: >= 20.15

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
- [Ssemble website](https://ssemble.com)
- [Ssemble MCP Server](https://github.com/ssembleinc/ssemble-mcp-server) (for Claude, Cursor, Windsurf)
- [npm: @ssemble/mcp-server](https://www.npmjs.com/package/@ssemble/mcp-server)
