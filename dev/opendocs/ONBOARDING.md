# OpenDocs — ONBOARDING.md

## Welcome to the Future of Documentation

OpenDocs (Feb 2026 Edition) is not just a document editor. It is a **Unified Orchestration Engine** for teams that value speed, relational data, and AI-powered automation.

---

## 🏗 Admin & Developer Onboarding

### The Three Pillars of OpenDocs
1. **Relational Data (Supabase):** Every Database block in a document provisions a real, deterministic Postgres table. Use this for structured tasks, roadmaps, and member lists.
2. **Visual Intelligence (Excalidraw/ReactFlow):** Documentation is visual. Use "Draw" blocks for free-form ideas and "Database Flow" views to map relational data onto a canvas.
3. **Autonomous Agency (NVIDIA Kimi):** The AI Agent (`Cmd+J`) can control the application. Ask it to "Build a structure for a project management doc" and watch it execute.

### Integration Stack
- **OpenClaw Bridge:** Connects to WhatsApp/Meta. All credentials live server-side for security.
- **n8n Nodes:** Insert real n8n modules as document blocks. Connect them visually to build backend automations without leaving your knowledge base.

---

## 🚀 User Quick-Start Guide

### ⌨️ Key Commands
- `/` : Open the **Slash Menu** to insert 20+ different block types.
- `Cmd+K` : Open the **Command Palette** for rapid app navigation and actions.
- `Cmd+J` : Open the **AI Agent Chat** (Global context).
- `Cmd+G` : Open the **AI Generator** to ingest URLs or topics.
- `Sidebar Search` : Use the search bar in the sidebar to filter through pages instantly.

### 📊 Relational Databases
1. Insert a "Database" block.
2. Switch between **Table**, **Kanban**, **Workflow**, and **Roadmap** views using the toggle in the block header.
3. Your data stays in sync regardless of the view.

### 🤖 Per-Block AI
- Look for the **Bot Icon** on any block toolbar.
- Each block has its own dedicated AI mini-chat.
- Ask the AI to "Refactor this code," "Summarize this table," or "Add a connection to this n8n node."

---

## 🔒 Security & Data Safety (Rule R2)
- **Hard Locks:** Click the 🔓 icon on any block to protect it.
- Locked blocks **cannot be deleted or modified** by you or the AI until unlocked.
- This ensures your "Single Source of Truth" remains untampered.

---

OpenDocs is designed for local-first reliability. Ensure your local containers are configured in `.env` to unlock the full power of real-time sync and provisioning.

---

## Prerequisites

### System Requirements
- Node.js 18+
- 8GB RAM minimum (16GB recommended)
- 500MB free disk space
- macOS, Windows, or Linux

### Software Dependencies
- npm or yarn
- Git 2.30+
- PostgreSQL 14+ (local or managed service)
- Optional: Docker 20.10+ for containerized setup

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Developer Tools
- VS Code recommended (with TypeScript extension)
- Postman or similar for API testing
- Git client configured
- Terminal/CLI access

### Account Requirements
- GitHub account (for Git operations)
- Supabase account or self-hosted instance access
- n8n account or self-hosted instance access (optional)

### Network Requirements
- Stable internet connection
- Port 3000 (API server)
- Port 5173 (Frontend dev server)
- Port 5432 (PostgreSQL) if local database
- Port 5555 (Supabase) if containerized

**Estimated Setup Time:** 30-45 minutes for complete environment configuration

---

## 💻 Installation & Setup

### Prerequisites Check
Before starting, verify you have completed all items in the Prerequisites section above.

### Step-by-Step Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/opendocs.git
   cd opendocs
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the Development Server**
   ```bash
   npm run dev
   # Frontend available at http://localhost:5173
   ```

5. **Start the API Server (in new terminal)**
   ```bash
   node server.js
   # API available at http://localhost:3000
   ```

### Verify Installation
- Visit http://localhost:5173 in your browser
- Check that the UI loads without errors
- Run API health check: http://localhost:3000/api/health

### Common Setup Issues

| Issue | Solution |
|-------|----------|
| **Port already in use** | Change ports in `.env` or kill existing processes with `lsof -i :PORT` |
| **Module not found** | Run `npm install` again and check `node_modules/` directory |
| **Environment variables missing** | Copy `.env.example` and update all values |
| **npm install fails** | Try `npm cache clean --force` then install again |
| **Build errors** | Ensure Node.js 20+ is installed with `node --version` |

### Typical Setup Time
- **Full Installation:** 10-15 minutes
- **With Database Setup:** 20-25 minutes
- **With n8n Integration:** 30-40 minutes

---

## ⚙️ Configuration

### Environment Variables

Configure your `.env` file with the following variables:

- `NODE_ENV` - Set to `development` or `production`
- `VITE_API_BASE` - API endpoint (e.g., `http://localhost:3000`)
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `NVIDIA_API_KEY` - Your NVIDIA API key (optional)
- `N8N_INSTANCE_URL` - Your n8n instance URL (optional)
- `OPENCLAW_API_KEY` - Your OpenClaw API key (optional)

### Port Configuration

Ports can be customized in `.env`:
- `VITE_PORT=5173` - Frontend dev server
- `API_PORT=3000` - Express API server

### Database Setup (Optional)

For local PostgreSQL or Supabase:
1. Create database: `createdb opendocs`
2. Run migrations: `npm run migrate`
3. Seed data: `npm run seed`

---

## 🗄️ Advanced Database Features

### Creating Database Tables

Use the Database block to create and manage tables:

1. **Create a table** - Click "Add Database Block"
2. **Define columns** - Add fields with types (text, number, date, etc.)
3. **Set relationships** - Link to other tables for relational data
4. **Add constraints** - Unique, not null, default values
5. **Enable Realtime** - Supabase will auto-sync changes

### Querying Data

The Query Builder allows no-code SQL:

- **Filters:** `where age > 18 AND status = 'active'`
- **Sorting:** `order by created_at DESC`
- **Pagination:** `limit 20 offset 0`
- **Aggregations:** `count()`, `sum()`, `avg()`, `max()`, `min()`
- **Joins:** Link related tables automatically

### Data Validation

Apply validation rules to ensure data integrity:

- **Email validation:** Automatic email format checking
- **URL validation:** Proper URL format required
- **Numeric ranges:** Min/max value constraints
- **Text patterns:** Regex-based validation
- **Required fields:** Prevent empty values

### Performance Optimization

For large datasets:

1. **Add indexes** on frequently queried columns
2. **Use pagination** to limit query results
3. **Enable caching** for static data
4. **Denormalize** where performance is critical
5. **Archive old data** to keep active tables lean

---

## 👥 Advanced User Features

### User Profiles & Customization

Create rich user profiles with custom fields and preferences:

```javascript
// User profile with custom fields
const userProfile = {
  id: 'user_123',
  name: 'Jane Developer',
  email: 'jane@example.com',
  preferences: {
    theme: 'dark',
    language: 'en',
    notifications: true,
    timezone: 'UTC'
  },
  customFields: {
    department: 'Engineering',
    team: 'Platform',
    role: 'Senior Developer'
  }
};
```

### Collaboration & Permissions

Manage fine-grained permissions across teams:

- **Owner:** Full access, can delete and manage all resources
- **Editor:** Can create, edit, and delete content
- **Viewer:** Read-only access to published content
- **Commenter:** Can view and add comments to documents

### Real-Time Collaboration

Enable simultaneous editing with presence indicators:

```javascript
// Real-time collaboration setup
const collaboration = {
  documentId: 'doc_456',
  activeUsers: [
    { userId: 'user_123', name: 'Jane', cursor: { line: 42, column: 15 } },
    { userId: 'user_789', name: 'John', cursor: { line: 50, column: 20 } }
  ],
  lastSyncTime: '2026-02-03T10:30:00Z'
};
```

### Notifications & Activity Feed

Stay updated with real-time notifications and activity tracking:

- Document changes by team members
- Comments and mentions
- Access requests and approvals
- System announcements

---

## 🤝 Team Collaboration & Workflows

Team collaboration is essential for modern documentation. This section covers how to set up teams, manage permissions, and use OpenDocs as a collaborative workspace.

### Setting Up Teams

Create and manage teams within OpenDocs to organize your workspace:

```typescript
// Create a team
const team = await client.teams.create({
  name: 'Engineering',
  description: 'Engineering team workspace',
  owner: userId,
  members: [userId, collaboratorId]
});

// Add members to team
await client.teams.addMember(teamId, newMemberId, {
  role: 'editor' // or 'viewer', 'commenter'
});

// Set team permissions
await client.teams.setPermission(teamId, {
  defaultRole: 'viewer',
  publicAccess: false
});
```

### Managing Document Access

Control who can access, edit, and share your documents:

- **Owner:** Full control - create, edit, delete, manage permissions
- **Editor:** Can create, edit content within shared documents
- **Commenter:** Can read and comment, but cannot edit content
- **Viewer:** Read-only access to documents

### Collaborative Editing

Work together in real-time with conflict-free collaborative editing (CRDT):

- **Live Cursors:** See where other team members are editing
- **Change Tracking:** View all edits with timestamps and authors
- **Version History:** Access any previous version of your document
- **Comments & Mentions:** Tag team members with @mentions for feedback

### Document Sharing & Publishing

Share your work with different visibility levels:

- **Private:** Only invited team members can access
- **Internal:** All team members can discover and access
- **Public:** Anyone with the link can view (read-only by default)
- **Published:** Generate shareable snapshots with version control

### Activity & Notifications

Stay informed about changes to shared documents:

- **Activity Feed:** Timeline of all document changes and comments
- **@Mentions:** Receive notifications when tagged by team members
- **Email Digests:** Daily or weekly summaries of team activity
- **Subscription Management:** Control which documents trigger notifications

---

## 🚀 Deployment & Hosting

Your OpenDocs instance is built to scale. Whether you're running locally, deploying to production, or scaling across multiple servers, we've got you covered.

### Deploying to Production

When you're ready to go live, OpenDocs supports multiple deployment strategies:

```bash
# Build for production
npm run build

# Start production server
npm start

# Or use environment variables for configuration
DATABASE_URL=postgresql://user:pass@prod-db:5432/opendocs \
API_DOMAIN=api.yourdomain.com \
npm start
```

Deploy to **Vercel** (recommended for Next.js):
```bash
vercel deploy --prod
```

Or **Netlify**:
```bash
netlify deploy --prod --dir=.next
```

### Docker & Containerization

Run OpenDocs in a Docker container for consistent environments across development and production:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t opendocs:latest .
docker run -p 3000:3000 \
  -e DATABASE_URL=postgresql://... \
  -e API_DOMAIN=api.yourdomain.com \
  opendocs:latest
```

### Environment Configuration

All deployment environments require proper configuration:

- **Development:** `.env.local` (never commit to git)
- **Production:** Environment variables via hosting platform
- **Critical Variables:**
  - `DATABASE_URL` — PostgreSQL connection string
  - `API_DOMAIN` — Public API domain
  - `JWT_SECRET` — Secure random string (minimum 32 characters)
  - `NEXTAUTH_SECRET` — Authentication secret
  - `NEXTAUTH_URL` — Full authentication URL

### CI/CD Pipelines

Automate testing and deployment with GitHub Actions:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test
      - run: npm run build
      - name: Deploy to Vercel
        uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

### Monitoring & Logging

Monitor your production instance with proper logging and alerting:

- **Application Logs:** Check `logs/` directory or streaming service
- **Error Tracking:** Integrate Sentry or similar for error monitoring
- **Performance:** Monitor response times with New Relic or Datadog
- **Database:** PostgreSQL query performance and connection pooling
- **Uptime Monitoring:** Use status page services for public transparency

---

## 🤝 Contributing & Support

### Contributing to OpenDocs

OpenDocs is an open-source project and welcomes contributions from the community.

**Before Contributing:**
- Review the [Contributing Guidelines](./CONTRIBUTING.md)
- Check existing issues and pull requests
- Fork the repository and create a feature branch
- Follow the coding standards (TypeScript strict mode)

**Submit a Pull Request:**
1. Implement your feature or fix
2. Add tests for your changes
3. Update documentation
4. Submit PR with clear description of changes
5. Respond to code review feedback

### Support & Community

Need help? We're here to support you:

**Documentation & Guides:**
- [README.md](./README.md) — Project overview and quick start
- [ARCHITECTURE.md](./ARCHITECTURE.md) — Technical architecture
- [API-ENDPOINTS.md](./API-ENDPOINTS.md) — REST API reference

**Community Channels:**
- **GitHub Issues:** Report bugs and feature requests
- **Discussions:** Ask questions and share ideas
- **Email:** support@opendocs.io

**Response Times:**
- Critical bugs: 24 hours
- Feature requests: 1-3 days
- General support: 2-5 business days

### Additional Resources

**External Links:**
- Supabase Documentation: https://supabase.com/docs
- n8n Documentation: https://docs.n8n.io
- NVIDIA API: https://api.nvidia.com
- React Documentation: https://react.dev

**Video Tutorials:**
- Getting Started with OpenDocs (15 min)
- Building Your First Database (10 min)
- Creating Workflows with n8n (12 min)

---

## 📖 Getting Started — Your First Page

### Creating a New Page

To create your first page in OpenDocs, you have two options:

**Option 1: Using the Sidebar**
1. Click the **+ New Page** button in the left sidebar
2. Give your page a title (e.g., "Project Dashboard", "Team Roadmap")
3. Optionally select an icon for quick visual identification
4. Click **Create** — your blank page is ready

**Option 2: Using the Slash Menu**
1. Position your cursor in any document area
2. Type `/` to open the Slash Menu
3. Search for "Page" or scroll to find **New Page**
4. Select it and fill in the details
5. Your new page will appear in the sidebar and opens automatically

### Page Naming Conventions

Follow these naming patterns for consistency and clarity:

| Pattern | Example | Use Case |
|---------|---------|----------|
| **[Type] - [Scope] - [Topic]** | `Project - Q1 2026 - Roadmap` | Major initiatives |
| **[Date] - [Topic]** | `2026-02-01 - Weekly Standup` | Time-based docs |
| **[Team] - [Subject]** | `Engineering - API Standards` | Team resources |
| **[Domain]/[Topic]** | `Marketing/Brand Guidelines` | Knowledge base |

**Best Practice:** Use clear, searchable names. Avoid "Untitled" or vague titles.

### Page Icons and Metadata

Each page can have a custom icon to make sidebar navigation faster:

```typescript
// Icons are stored in page metadata:
{
  id: "page-uuid",
  title: "Project Dashboard",
  icon: {
    type: "emoji",      // "emoji" | "lucide" | "custom"
    value: "📊"         // emoji string, Lucide icon name, or URL
  },
  color: "#3B82F6"      // Optional: sidebar label color
}
```

**To change a page icon:**
1. Right-click on the page title in the sidebar
2. Select **Edit Metadata**
3. Choose your icon type (Emoji, Lucide, or Custom Upload)
4. Confirm — the icon updates immediately

### Managing Page Hierarchy

Pages can be organized in a nested hierarchy for complex projects:

- **Top-Level Pages:** High-level topics (e.g., "Projects", "Team")
- **Sub-Pages:** Nested under parent pages via drag-and-drop in the sidebar
- **Depth Limit:** Recommended max 3 levels for usability

**To create a sub-page:**
1. Drag a page onto another page in the sidebar
2. It becomes a child and appears indented
3. Click the **►** arrow next to the parent to collapse/expand
4. All data persists in Supabase with parent-child relationships

### Quick Reference Commands

| Command | Action |
|---------|--------|
| `Cmd+N` | New Page (anywhere in app) |
| `Cmd+K` then `Page` | Command Palette → Create Page |
| `/page` | Slash Menu → Insert Page Link |
| `Right-click Page` | Context menu → Duplicate, Delete, Export |

> **💡 Pro Tip:** Use `/` within a document to insert **links to other pages**. This keeps your knowledge base interconnected.

---

## 🗄️ Database Blocks Deep Dive

### How to Insert a Database Block

A Database block provisions a real Supabase PostgreSQL table and displays it in multiple views:

**Steps:**
1. Type `/` in your document to open the Slash Menu
2. Search for "**Database**" or scroll down
3. Click **Database Block**
4. You'll be prompted to:
   - **Name your table** (e.g., "Project Tasks", "Team Members")
   - **Select initial view** (defaults to Table)
5. Your database table is now created and visible

Behind the scenes, OpenDocs has:
- ✅ Provisioned a real PostgreSQL table in Supabase
- ✅ Created an index for fast queries
- ✅ Set up real-time subscriptions for live sync
- ✅ Stored the table schema in your document metadata

### 6 Dynamic Views Explained

Every database table supports 6 different views for different use cases:

| View | Best For | Key Feature |
|------|----------|-------------|
| **Table** | Structured data, quick editing | Rows/columns, inline filters |
| **Kanban** | Task management, workflow stages | Drag-drop cards by status |
| **Flow/Graph** | Visual relationships, dependencies | Node-based graph layout |
| **Calendar** | Dates, timelines, schedules | Month/week/day view |
| **Timeline** | Project phases, Gantt charts | Time-based swimlanes |
| **Gallery** | Visual inventory, portfolio | Card-based media display |

**Example:** A "Projects" table can show:
- **Table view:** All columns (Name, Owner, Status, Budget)
- **Kanban view:** Same data grouped by Status (Backlog → In Progress → Done)
- **Calendar view:** Same data with due dates visible in calendar
- **Timeline view:** Same data as a Gantt chart by start/end dates

All views share the same underlying data — changes in one view update all others instantly.

### Creating Your First Database Table

Let's build a **Product Inventory** table:

1. **Insert Database Block**
   ```
   Click "/" → Search "Database" → Click "Database Block"
   ```

2. **Name the Table**
   ```
   Table Name: "Products"
   ```

3. **Add Columns** (click "+" in the header)
   - Column 1: `product_name` (Type: Text)
   - Column 2: `sku` (Type: Text)
   - Column 3: `quantity` (Type: Number)
   - Column 4: `price` (Type: Number)
   - Column 5: `status` (Type: Select: Active/Discontinued/Discontinued)

4. **Add Rows** (click "+" at bottom of table)
   ```
   | product_name | sku | quantity | price | status |
   |--------------|-----|----------|-------|--------|
   | Wireless Mouse | SKU-001 | 150 | 29.99 | Active |
   | Mechanical Keyboard | SKU-002 | 87 | 99.99 | Active |
   | USB-C Cable | SKU-003 | 0 | 9.99 | Discontinued |
   ```

5. **Switch Views**
   - Click the **View Toggle** button in the database header
   - Try **Kanban**: Group by Status
   - Try **Gallery**: Display product images if available

### Real-Time Sync Explanation

When you insert a Database block, OpenDocs creates a **subscription** to Supabase Real-Time:

```typescript
// Behind the scenes:
const subscription = supabase
  .channel('products')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'products' },
    (payload) => {
      // Any change (INSERT, UPDATE, DELETE) updates the UI instantly
      syncLocalStore(payload);
    }
  )
  .subscribe();
```

**What this means:**
- ✅ Changes are **instant** across all views
- ✅ If a teammate edits the table, you see it live (with team accounts)
- ✅ All data persists in the database (not just local storage)
- ✅ You can query via SQL if you access Supabase directly

> **🔒 Important (Rule R2):** If a database block is **Hard Locked**, it cannot be edited. The lock prevents accidental changes to critical tables.

---

## 🤖 AI Prompt Block Workflow

### What is the AI Prompt Block?

The **AI Prompt Block** is a special block type that uses natural language to generate complex document structures:

```
Type: "/" → Search "AI Prompt" → Describe what you want
↓
OpenDocs sends your prompt to NVIDIA Kimi API
↓
AI generates: Tables, Lists, Code, Guides, Diagrams
↓
You approve and insert the generated structure into your document
```

**Example Prompt:**
> "Create a project management table with columns for Task, Owner, Status, Due Date, and Priority. Add 5 sample rows for a Q1 product launch."

**AI Output:**
```
Generated Database Block:
Table: "Q1 Product Launch"
Columns: Task | Owner | Status | Due Date | Priority
Rows: (5 pre-filled examples)
```

### Per-Block AI vs. Global AI

OpenDocs provides **two AI interfaces**:

| Feature | Per-Block AI | Global AI (`Cmd+J`) |
|---------|-----------|------------|
| **Access** | Bot icon on block toolbar | Keyboard shortcut |
| **Context** | Only that specific block | Entire document |
| **Use Cases** | Refactor, Summarize, Transform | Plan, Generate, Brainstorm |
| **Speed** | Fast (~2s) | Fast (~3s) |

**Per-Block AI Example:**
```
You have a code block:
  function addNumbers(a, b) { return a + b; }

Click the Bot icon → "Refactor this code to use TypeScript"
↓
AI Output:
  function addNumbers(a: number, b: number): number {
    return a + b;
  }
```

**Global AI Example:**
```
Press Cmd+J → "Build a complete API documentation structure"
↓
AI generates an entire page with:
  - Overview section
  - Authentication guide
  - Endpoint reference
  - Error codes
  - Code examples
```

### Common Use Cases

1. **Documentation Generation**
   - Prompt: "Write an API documentation guide for a REST endpoint that creates users"
   - Output: Complete guide with examples, error codes, authentication

2. **Code Review**
   - Prompt: "Review this code for security vulnerabilities and suggest fixes"
   - Output: Inline comments with vulnerabilities and solutions

3. **Data Summarization**
   - Prompt: "Summarize this table of sales data and highlight top performers"
   - Output: Executive summary with insights and recommendations

4. **Content Transformation**
   - Prompt: "Convert this technical guide into a beginner-friendly tutorial"
   - Output: Simplified version with step-by-step instructions

### Step-by-Step: Generate a Database Schema via AI

**Scenario:** You need to design a database for a task management app.

1. **Insert AI Prompt Block**
   ```
   Click "/" → Search "AI Prompt" → Click "AI Prompt Block"
   ```

2. **Type Your Prompt**
   ```
   "Design a database schema for a task management app with:
   - Users table with name, email, role
   - Projects table linked to users (owner relationship)
   - Tasks table with title, description, status, priority, assignee, due date
   - Comments table for task discussions
   
   Include sample data for 3 users, 2 projects, and 5 tasks"
   ```

3. **Click Generate**
   ```
   AI processes and generates the schema
   ```

4. **Review the Output**
   ```
   Users (id, name, email, role)
   Projects (id, name, owner_id, created_at)
   Tasks (id, title, description, status, priority, assignee_id, project_id, due_date)
   Comments (id, task_id, user_id, text, created_at)
   ```

5. **Approve and Insert**
   ```
   Click "Insert" → Database blocks are created for each table
   ```

6. **Refine as Needed**
   ```
   Use per-block AI to add columns, populate data, or adjust structure
   ```

### Step-by-Step: Ask AI to Refactor Code Block

**Scenario:** You have a JavaScript function that needs TypeScript conversion.

1. **Find Your Code Block**
   ```typescript
   const processUser = (user) => {
     return {
       name: user.name.toUpperCase(),
       email: user.email.toLowerCase(),
       age: user.age + 1
     };
   };
   ```

2. **Click the Bot Icon** (right-side toolbar)

3. **Type Your Request**
   ```
   "Convert this to TypeScript with proper types and add JSDoc comments"
   ```

4. **Click Generate**

5. **Review the Output**
   ```typescript
   /**
    * Process user data with transformations
    * @param user - User object with name, email, age
    * @returns Processed user object with standardized formatting
    */
   const processUser = (user: { name: string; email: string; age: number }): {
     name: string;
     email: string;
     age: number;
   } => {
     return {
       name: user.name.toUpperCase(),
       email: user.email.toLowerCase(),
       age: user.age + 1
     };
   };
   ```

6. **Accept or Refine**
   ```
   Click "Apply" to replace, or request additional changes
   ```

### Best Practices for AI Prompts

1. **Be Specific**
   - ❌ "Create a table"
   - ✅ "Create a table with 5 columns for managing blog posts (Title, Author, Status, Published Date, Category)"

2. **Include Context**
   - ❌ "Write a guide"
   - ✅ "Write a setup guide for developers integrating our REST API with error handling examples"

3. **Specify Output Format**
   - ❌ "Generate code"
   - ✅ "Generate a TypeScript class with proper error handling and JSDoc comments"

4. **Iterate and Refine**
   - If the output isn't perfect, use follow-up prompts:
   - "Add error handling"
   - "Convert to async/await"
   - "Add more examples"

> **Rule R3:** Always read and edit AI-generated content before using it in production. The AI can hallucinate or make mistakes. Verify logic, test code, and validate data.

---

## 🔗 n8n Integration for Automation

### What are n8n Workflow Blocks?

n8n is a visual workflow automation platform. OpenDocs lets you **embed n8n workflows directly as document blocks**:

```
You insert an "n8n Workflow" block
↓
It connects to your local n8n instance
↓
You design workflows visually within the document
↓
Trigger and execute workflows without leaving your doc
```

**Real-world example:**
```
Document: "Customer Onboarding"
├── n8n Block 1: Trigger webhook when new customer added
├── n8n Block 2: Send welcome email via SMTP
├── n8n Block 3: Add customer to CRM
└── n8n Block 4: Log event to analytics
```

### How to Insert an n8n Node

1. **Open the Slash Menu**
   ```
   Type "/" in your document
   ```

2. **Search for n8n**
   ```
   Type "n8n" to filter the slash menu
   ```

3. **Select "n8n Workflow Block"**
   ```
   Click it to insert a workflow canvas
   ```

4. **Wait for Connection**
   ```
   The block connects to n8n server (http://localhost:5678 by default)
   If connection fails, check .env variables
   ```

5. **Design Your Workflow**
   ```
   You now have a blank canvas where you can:
   - Search and add nodes from n8n library
   - Connect nodes with lines
   - Configure each node's parameters
   ```

### Connecting n8n Blocks Visually

n8n uses a **node-based editor** within the block:

**Steps:**
1. **Add Trigger Node**
   - Click "Add Node" or the **+** button
   - Search "Webhook" or "Cron" to trigger on schedule
   - Configure when the workflow should run

2. **Add Action Nodes**
   - Click "Add Node" again
   - Search for services (Gmail, Slack, HTTP, Database, etc.)
   - Connect the trigger to the action (drag output → input)

3. **Add Condition (Optional)**
   - Use "IF" nodes to branch based on data
   - Example: "If Status = Approved, send email"

4. **Test Each Connection**
   - Hover over a connection and click the **play icon** to test that segment
   - View the data flowing between nodes

**Visual Example:**
```
[Webhook Trigger] → [Read from Database] → [Filter by Status]
                                               ↓
                                        [If Status = Active]
                                               ↓
                                    [Send Email to User]
```

### Triggering Workflows from Documents

Once your workflow is designed, you can trigger it in multiple ways:

**Option 1: Manual Trigger**
```
Click the "Play" button in the n8n block header
→ Workflow executes immediately
→ Results display below the block
```

**Option 2: Webhook Trigger**
```
n8n generates a unique URL like:
  http://localhost:5678/webhook/abc123def

You can POST data to this URL from:
- Another application
- A form submission in OpenDocs
- External webhooks
```

**Option 3: Cron Trigger (Scheduled)**
```
Configure cron schedule in the workflow:
  "Every day at 9 AM"
  "Every hour"
  "Every Monday"

n8n executes automatically
```

### Testing n8n Workflows Inline

**Built-in Testing:**
1. Click the **Test** button in the n8n block toolbar
2. If the workflow has inputs, fill them in
3. Click **Execute**
4. View the **execution log** showing each node's output
5. Debug any errors in the inline log viewer

**Example Execution Log:**
```
Node 1 [Webhook]: Input received
  → { email: "user@example.com", action: "signup" }

Node 2 [Database Query]: Returned 1 record
  → { user_id: 123, name: "John" }

Node 3 [Email]: Email sent successfully
  → { status: "sent", message_id: "xyz" }

Result: ✅ Workflow completed in 2.3s
```

### Example: Automated Content Summarization

**Scenario:** Every time a blog post is published, automatically generate a summary and post it to Slack.

**Workflow Design:**

```
1. Trigger: Webhook (triggered when blog post published)
   Input: { title, content, author }

2. Node 2: AI Summarize (call NVIDIA API)
   Input: blog content
   Output: 2-sentence summary

3. Node 3: Slack Message
   Input: summary, title, author
   Action: Post to #blog-updates channel

4. Node 4: Log to Database
   Input: blog ID, summary
   Action: Store in "Blog Summaries" table
```

**To implement:**
1. Insert n8n Workflow Block
2. Add Webhook trigger node
3. Add "OpenAI" node for summarization (or custom HTTP call)
4. Add "Slack" node to post message
5. Add "Supabase" node to store result
6. Connect all nodes
7. Test with sample data
8. Deploy by activating the workflow

---

## 🎨 UI Features & Customization

### Theme Toggle (Light/Dark Mode)

OpenDocs supports full light and dark themes:

**How to Switch:**
1. Click your **profile icon** (top-right corner)
2. Select **Settings**
3. Under **Appearance**, toggle **Dark Mode**
4. Theme switches immediately
5. Preference is saved to local storage (persists across sessions)

**Color Scheme Details:**
- **Light Mode:** White/gray backgrounds, dark text
- **Dark Mode:** Dark gray/black backgrounds, light text
- **Accent Colors:** Blue for highlights, red for warnings (consistent across themes)

### Icon System (Emoji, Lucide, Custom Upload)

Every page and block can have a custom icon:

**Icon Types:**

| Type | How to Use | Examples |
|------|-----------|----------|
| **Emoji** | Click icon picker → Select emoji | 📊, 🚀, 📝, 🔒 |
| **Lucide Icons** | Click icon picker → Search icon name | `Globe`, `Code`, `Database` |
| **Custom Upload** | Click icon picker → Upload image | Logo, screenshot, diagram |

**To change an icon:**
1. Click the icon next to a page/block name
2. Choose icon type (Emoji, Lucide, or Custom)
3. Select or upload your icon
4. Icon updates immediately in sidebar and document

### Block Toolbar Overview

Every block has a toolbar in the top-right corner:

| Button | Function |
|--------|----------|
| **⋮** | More options (duplicate, delete, export) |
| **Bot** | Per-block AI chat |
| **🔓/🔒** | Toggle Hard Lock (Rule R2) |
| **⋯⋯** | Resize/drag block |
| **View Toggle** | Switch views (for database blocks) |

### Block Locking / Hard Locks (Rule R2)

Hard Locks protect critical blocks from accidental or AI-driven changes:

**How to Lock a Block:**
1. Click the **🔓** icon in the block toolbar
2. Block turns gray and shows **🔒** icon
3. Now **neither you nor the AI can edit this block**
4. To unlock, click 🔒 again (requires confirmation)

**Use Cases:**
- Protect critical configuration blocks
- Lock data tables that shouldn't change automatically
- Secure documentation headers that define business rules

**Important:** Hard Locks are **rule-enforced**. The AI respects locks and will not modify locked blocks (Rule R2).

### Sidebar Search Functionality

The left sidebar has a **Search Box** at the top:

**To Use:**
1. Click in the search box (or press `Cmd+;`)
2. Type a page name or keyword
3. Matching pages appear instantly
4. Click to navigate
5. Search is real-time (no lag)

**Smart Features:**
- ✅ Searches page titles, descriptions, and tags
- ✅ Fuzzy matching (finds "Roadmap" when you type "road")
- ✅ Highlights matching text
- ✅ Shows hierarchy (e.g., "Projects > Q1 > Roadmap")

### Command Palette (Cmd+K) Features

Press **Cmd+K** anywhere to open the Command Palette:

| Command | Function |
|---------|----------|
| `Page: Create` | New page |
| `Page: Search` | Find and jump to page |
| `Page: Rename` | Rename current page |
| `Page: Export` | Export page as markdown |
| `Theme: Toggle` | Switch light/dark mode |
| `Database: Create` | Insert database block |
| `Help: Keyboard Shortcuts` | View all shortcuts |

**Quick Actions:**
```
Cmd+K → type "new page" → Enter
```

> **Pro Tip:** Most actions in OpenDocs can be accessed via Command Palette. It's often faster than clicking.

---

## 👥 User Personas & Common Workflows

### Beginner: "I Just Want to Document My Ideas"

**Profile:**
- New to structured documentation
- Prefers simple, visual tools
- Not comfortable with databases or code

**Recommended Features:**
1. **Text Blocks** — Write freely with formatting
2. **Drawing Blocks** — Sketch ideas visually
3. **Simple Lists** — Organize thoughts hierarchically
4. **Page Organization** — Use sidebar folders

**Workflow:**
```
1. Create new page "My Project Ideas"
2. Add text blocks for each idea
3. Add drawings for visual concepts
4. Share the page with the team
```

**Feature Matrix:**
- ❌ Databases (too complex)
- ❌ n8n Workflows (advanced)
- ✅ AI Prompt Block (to refine ideas)
- ✅ Dark mode and icons (for aesthetics)

### Intermediate: "I Need Structured Data and Automations"

**Profile:**
- Comfortable with spreadsheets/databases
- Wants to organize data and automate tasks
- Needs to track projects, teams, tasks

**Recommended Features:**
1. **Database Blocks** — Store and query data
2. **Kanban Views** — Track workflow stages
3. **If/Then Automations** — Trigger actions on data changes
4. **n8n Workflows** — Connect external services

**Workflow:**
```
1. Create "Project Tracker" database
   Columns: Project Name, Owner, Status, Due Date, Budget
2. Use Kanban view to see status at a glance
3. Set up n8n workflow to notify owner when due date approaches
4. Add database views for different teams
```

**Feature Matrix:**
- ✅ Databases (core need)
- ✅ n8n Workflows (moderate use)
- ✅ AI for summarization
- ✅ Multiple views (Table, Kanban, Calendar)
- ❌ Custom scripts (not available)

### Advanced: "I'm Building a Knowledge Management System"

**Profile:**
- Deep technical knowledge
- Builds complex systems with cross-linked databases
- Integrates with multiple external APIs
- Uses custom workflows and scripts

**Recommended Features:**
1. **Relational Databases** — Multiple tables with foreign keys
2. **Complex n8n Workflows** — Multi-step automations with conditions
3. **SSRF-Hardened Scraping** — Safely fetch external data
4. **Hard Locks** — Protect critical data structures
5. **API Integration** — Direct PostgreSQL access via Supabase API

**Workflow:**
```
1. Create master "Company KnowledgeBase" with:
   - Users table
   - Documents table (linked to Users)
   - Topics table
   - Document-Topic relationships
   
2. Build n8n workflows:
   - Auto-tag documents based on content
   - Notify relevant teams of updates
   - Generate weekly digests
   
3. Use Hard Locks on schema to prevent accidental changes

4. Export data to external analytics platform
```

**Feature Matrix:**
- ✅ Relational Databases (heavily used)
- ✅ Advanced n8n Workflows (complex logic)
- ✅ API Access (Supabase + external)
- ✅ Hard Locks (production protection)
- ✅ Custom integrations (OpenClaw, webhooks)
- ✅ Performance optimization

---

## ❓ Troubleshooting & FAQs

### Q: My database won't sync with Supabase

**Cause:** Connection issue or missing environment variables

**Solution:**
1. Check `.env` file for `SUPABASE_URL` and `SUPABASE_KEY`
2. Verify values are correct (copy from Supabase dashboard)
3. Restart the server: `node server.js`
4. Hard-refresh browser: `Cmd+Shift+R`
5. Check browser console (F12) for error messages
6. If still broken, check Supabase project status online

### Q: AI block not responding or generating slow output

**Cause:** NVIDIA API key missing or rate-limited

**Solution:**
1. Verify `NVIDIA_API_KEY` is set in `.env`
2. Check API key is valid on NVIDIA console
3. Check rate limit: NVIDIA has 100 requests/min limit
4. Wait 1 minute and retry
5. For heavy use, consider self-hosted LLM (Ollama)

### Q: n8n workflow won't trigger

**Cause:** n8n service not running or webhook misconfigured

**Solution:**
1. Verify n8n is running: `docker ps | grep n8n`
2. Check n8n URL in env: should match your n8n address
3. Test webhook URL manually: `curl -X POST http://localhost:5678/webhook/your-id`
4. Check n8n logs for errors: `docker logs n8n-container`
5. Restart n8n: `docker restart n8n-container`

### Q: My changes aren't persisting locally

**Cause:** Local storage disabled or data cleared

**Solution:**
1. Check browser storage: F12 → Application → Local Storage
2. Verify "opendocs-store" key exists
3. Check browser privacy settings (allow local storage for site)
4. Try private/incognito window to test
5. Clear cache and reload: `Cmd+Shift+R`

### Q: I can't modify a locked block (Hard Lock)

**Cause:** Block is protected per Rule R2

**Solution:**
1. This is intentional — locked blocks cannot be edited
2. To unlock, click the **🔒** icon in block toolbar
3. Confirm the unlock action
4. Block is now editable
5. Use Hard Lock to protect critical data only

### Q: A page isn't appearing in the sidebar

**Cause:** Page not synced or rendering issue

**Solution:**
1. Hard-refresh browser: `Cmd+Shift+R`
2. Check if page exists in Supabase: Check "documents" table
3. Restart the server
4. Manually re-add the page if data was corrupted
5. Check browser console (F12) for errors

### Q: Block toolbar is frozen or unresponsive

**Cause:** React state issue or performance lag

**Solution:**
1. Refresh the page: `Cmd+R`
2. Clear browser cache: Settings → Clear Browsing Data
3. Close browser dev tools if open (can slow down rendering)
4. Check for browser extensions blocking content
5. Try in private/incognito window to isolate issue

---

## ✅ Best Practices Checklist

### Security Best Practices

- [ ] **Use Hard Locks** on critical blocks (Rule R2 compliance)
- [ ] **Keep `.env` secure** — never commit to git
- [ ] **Check data sensitivity** — don't store passwords in tables
- [ ] **Review access permissions** in Supabase for team members
- [ ] **Audit database changes** — log who modified what
- [ ] **Enable SSRF protection** when scraping external content

> **Rule R1 Reminder:** Never put secrets in client-side code. Use environment variables only.

### Performance Optimization

- [ ] **Use appropriate views** — don't load 10,000 rows in Gallery view
- [ ] **Index frequently-queried columns** in databases
- [ ] **Archive old data** — move historical data to separate tables
- [ ] **Enable caching** for static content blocks
- [ ] **Limit real-time subscriptions** — don't subscribe to tables you don't need
- [ ] **Lazy-load pages** — don't open all pages on startup

> **Performance Budget:** Hydration < 100ms, FCP < 1.2s

### Data Backup Strategy

- [ ] **Export critical tables** monthly as CSV
- [ ] **Version control documents** using git branches
- [ ] **Use Supabase backups** (automatic daily)
- [ ] **Test recovery** — periodically restore from backup
- [ ] **Document recovery procedures** for your team
- [ ] **Back up `.env` file** (store securely, never in git)

### Page Organization

- [ ] **Use clear naming** — avoid "Untitled" or generic titles
- [ ] **Create hierarchy** — logical folder structure (max 3 levels deep)
- [ ] **Link related pages** — use `/page` syntax to cross-reference
- [ ] **Archive old pages** — don't clutter active sidebar
- [ ] **Use descriptions** — add metadata for search discoverability
- [ ] **Organize by team/function** — not by date or random grouping

### Naming Conventions

| Entity | Convention | Example |
|--------|-----------|---------|
| **Pages** | [Type] - [Scope] - [Topic] | `Project - Q1 2026 - Roadmap` |
| **Tables** | Plural, snake_case | `project_tasks`, `team_members` |
| **Columns** | snake_case, descriptive | `created_at`, `owner_id`, `status` |
| **Workflows** | Verb + Object | `sync_customers_to_crm`, `send_welcome_email` |
| **Variables** | camelCase, clear meaning | `totalRevenue`, `userEmail`, `isActive` |

### Error Recovery Procedures

| Error | Recovery Steps |
|-------|-----------------|
| **Lost data in table** | Restore from Supabase backup |
| **Corrupted page** | Delete page, recreate from backup |
| **Broken connection** | Restart server + browser refresh |
| **Lost local storage** | Re-sync from Supabase (automatic) |
| **n8n workflow error** | Check n8n logs, modify workflow, test |

> **Rule R3 Reminder:** Always read and verify AI-generated content before using it in production. Test changes in a staging environment first.
