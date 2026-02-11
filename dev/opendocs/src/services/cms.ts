import { useDocsStore } from "@/store/useDocsStore";
import { nanoid } from "nanoid";

/**
 * Content Management System Service
 * Advanced CMS features for enterprise content management
 */

export interface ContentVersion {
  id: string;
  pageId: string;
  version: number;
  createdAt: string;
  createdBy: string;
  content: string; // JSON string of page content
  description?: string;
}

export interface PublishingWorkflow {
  id: string;
  pageId: string;
  status: "draft" | "review" | "approved" | "published" | "archived";
  reviewers: string[];
  approvers: string[];
  publishedAt?: string;
  publishedBy?: string;
  scheduledPublishAt?: string;
}

export interface ContentAnalytics {
  pageId: string;
  views: number;
  uniqueViews: number;
  lastViewed: string;
  engagementTime: number; // seconds
  shares: number;
  comments: number;
}

export interface ContentMetadata {
  pageId: string;
  tags: string[];
  categories: string[];
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  openGraphImage?: string;
}

class CMSService {
  private versions: Map<string, ContentVersion[]> = new Map();
  private workflows: Map<string, PublishingWorkflow> = new Map();
  private analytics: Map<string, ContentAnalytics> = new Map();
  private metadata: Map<string, ContentMetadata> = new Map();

  // Content Versioning
  createVersion(pageId: string, description?: string): ContentVersion {
    const page = useDocsStore.getState().state.pages[pageId];
    if (!page) {
      throw new Error(`Page ${pageId} not found`);
    }

    const versions = this.versions.get(pageId) || [];
    const versionNumber = versions.length + 1;

    const version: ContentVersion = {
      id: nanoid(),
      pageId,
      version: versionNumber,
      createdAt: new Date().toISOString(),
      createdBy: "system", // Would be user ID in real implementation
      content: JSON.stringify(page),
      description,
    };

    versions.push(version);
    this.versions.set(pageId, versions);

    return version;
  }

  getVersions(pageId: string): ContentVersion[] {
    return this.versions.get(pageId) || [];
  }

  restoreVersion(versionId: string): boolean {
    for (const [pageId, versions] of this.versions) {
      const version = versions.find(v => v.id === versionId);
      if (version) {
        try {
          const pageData = JSON.parse(version.content);
          useDocsStore.getState().actions.updatePageContent(pageId, pageData.blocks);
          return true;
        } catch (error) {
          console.error("Failed to restore version:", error);
          return false;
        }
      }
    }
    return false;
  }

  // Publishing Workflows
  initiateWorkflow(pageId: string, reviewers: string[], approvers: string[]): PublishingWorkflow {
    const workflow: PublishingWorkflow = {
      id: nanoid(),
      pageId,
      status: "draft",
      reviewers,
      approvers,
    };

    this.workflows.set(pageId, workflow);
    return workflow;
  }

  updateWorkflowStatus(pageId: string, status: PublishingWorkflow["status"]): boolean {
    const workflow = this.workflows.get(pageId);
    if (!workflow) return false;

    workflow.status = status;
    if (status === "published") {
      workflow.publishedAt = new Date().toISOString();
      workflow.publishedBy = "system";
    }

    this.workflows.set(pageId, workflow);
    return true;
  }

  getWorkflow(pageId: string): PublishingWorkflow | undefined {
    return this.workflows.get(pageId);
  }

  schedulePublish(pageId: string, publishAt: string): boolean {
    const workflow = this.workflows.get(pageId);
    if (!workflow) return false;

    workflow.scheduledPublishAt = publishAt;
    workflow.status = "approved";
    this.workflows.set(pageId, workflow);
    return true;
  }

  // Content Analytics
  trackView(pageId: string, userId?: string): void {
    const analytics = this.analytics.get(pageId) || {
      pageId,
      views: 0,
      uniqueViews: 0,
      lastViewed: new Date().toISOString(),
      engagementTime: 0,
      shares: 0,
      comments: 0,
    };

    analytics.views++;
    if (userId) {
      // In a real implementation, we'd track unique users
      analytics.uniqueViews = Math.min(analytics.uniqueViews + 1, analytics.views);
    }
    analytics.lastViewed = new Date().toISOString();

    this.analytics.set(pageId, analytics);
  }

  trackEngagement(pageId: string, timeSeconds: number): void {
    const analytics = this.analytics.get(pageId);
    if (analytics) {
      analytics.engagementTime += timeSeconds;
      this.analytics.set(pageId, analytics);
    }
  }

  trackShare(pageId: string): void {
    const analytics = this.analytics.get(pageId);
    if (analytics) {
      analytics.shares++;
      this.analytics.set(pageId, analytics);
    }
  }

  trackComment(pageId: string): void {
    const analytics = this.analytics.get(pageId);
    if (analytics) {
      analytics.comments++;
      this.analytics.set(pageId, analytics);
    }
  }

  getAnalytics(pageId: string): ContentAnalytics | undefined {
    return this.analytics.get(pageId);
  }

  // Content Metadata
  setMetadata(pageId: string, metadata: Partial<ContentMetadata>): ContentMetadata {
    const existing = this.metadata.get(pageId) || {
      pageId,
      tags: [],
      categories: [],
    };

    const updated = { ...existing, ...metadata };
    this.metadata.set(pageId, updated);
    return updated;
  }

  getMetadata(pageId: string): ContentMetadata | undefined {
    return this.metadata.get(pageId);
  }

  addTag(pageId: string, tag: string): ContentMetadata {
    const metadata = this.metadata.get(pageId) || {
      pageId,
      tags: [],
      categories: [],
    };

    if (!metadata.tags.includes(tag)) {
      metadata.tags.push(tag);
    }

    this.metadata.set(pageId, metadata);
    return metadata;
  }

  removeTag(pageId: string, tag: string): ContentMetadata | undefined {
    const metadata = this.metadata.get(pageId);
    if (!metadata) return undefined;

    metadata.tags = metadata.tags.filter(t => t !== tag);
    this.metadata.set(pageId, metadata);
    return metadata;
  }

  addCategory(pageId: string, category: string): ContentMetadata {
    const metadata = this.metadata.get(pageId) || {
      pageId,
      tags: [],
      categories: [],
    };

    if (!metadata.categories.includes(category)) {
      metadata.categories.push(category);
    }

    this.metadata.set(pageId, metadata);
    return metadata;
  }

  removeCategory(pageId: string, category: string): ContentMetadata | undefined {
    const metadata = this.metadata.get(pageId);
    if (!metadata) return undefined;

    metadata.categories = metadata.categories.filter(c => c !== category);
    this.metadata.set(pageId, metadata);
    return metadata;
  }

  // Content Export
  exportContent(pageId: string, format: "markdown" | "html" | "json"): string {
    const page = useDocsStore.getState().state.pages[pageId];
    if (!page) {
      throw new Error(`Page ${pageId} not found`);
    }

    switch (format) {
      case "markdown":
        return this.exportToMarkdown(page);
      case "html":
        return this.exportToHTML(page);
      case "json":
        return JSON.stringify(page, null, 2);
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  private exportToMarkdown(page: any): string {
    let markdown = `# ${page.title}\n\n`;

    for (const block of page.blocks) {
      switch (block.type) {
        case "heading1":
          markdown += `# ${block.text}\n\n`;
          break;
        case "heading2":
          markdown += `## ${block.text}\n\n`;
          break;
        case "heading3":
          markdown += `### ${block.text}\n\n`;
          break;
        case "paragraph":
          markdown += `${block.text}\n\n`;
          break;
        case "code":
          markdown += `\`\`\`${block.language}\n${block.code}\n\`\`\`\n\n`;
          break;
        case "quote":
          markdown += `> ${block.text}\n\n`;
          break;
        case "checklist":
          for (const item of block.items) {
            markdown += `- [${item.checked ? 'x' : ' '}] ${item.text}\n`;
          }
          markdown += '\n';
          break;
        case "divider":
          markdown += `---\n\n`;
          break;
        default:
          // Skip unsupported block types for markdown
          break;
      }
    }

    return markdown;
  }

  private exportToHTML(page: any): string {
    let html = `<!DOCTYPE html>\n<html>\n<head>\n  <title>${page.title}</title>\n  <meta charset="UTF-8">\n</head>\n<body>\n  <h1>${page.title}</h1>\n`;

    for (const block of page.blocks) {
      switch (block.type) {
        case "heading1":
          html += `  <h1>${block.text}</h1>\n`;
          break;
        case "heading2":
          html += `  <h2>${block.text}</h2>\n`;
          break;
        case "heading3":
          html += `  <h3>${block.text}</h3>\n`;
          break;
        case "paragraph":
          html += `  <p>${block.text}</p>\n`;
          break;
        case "code":
          html += `  <pre><code class="language-${block.language}">${block.code}</code></pre>\n`;
          break;
        case "quote":
          html += `  <blockquote>${block.text}</blockquote>\n`;
          break;
        case "checklist":
          html += `  <ul>\n`;
          for (const item of block.items) {
            html += `    <li><input type="checkbox" ${item.checked ? 'checked' : ''}> ${item.text}</li>\n`;
          }
          html += `  </ul>\n`;
          break;
        case "divider":
          html += `  <hr>\n`;
          break;
        default:
          // Skip unsupported block types for HTML
          break;
      }
    }

    html += `</body>\n</html>`;
    return html;
  }

  // Content Import
  importContent(content: string, format: "markdown" | "html"): string {
    // This would be implemented based on specific import requirements
    // For now, we'll create a simple markdown import
    if (format === "markdown") {
      return this.importFromMarkdown(content);
    }
    
    throw new Error(`Import format ${format} not yet implemented`);
  }

  private importFromMarkdown(markdown: string): string {
    // Create a new page with imported content
    const pageId = nanoid();
    const lines = markdown.split('\n');
    const blocks: any[] = [];

    for (const line of lines) {
      if (line.startsWith('# ')) {
        blocks.push({
          id: nanoid(),
          type: "heading1",
          text: line.substring(2).trim(),
        });
      } else if (line.startsWith('## ')) {
        blocks.push({
          id: nanoid(),
          type: "heading2",
          text: line.substring(3).trim(),
        });
      } else if (line.startsWith('### ')) {
        blocks.push({
          id: nanoid(),
          type: "heading3",
          text: line.substring(4).trim(),
        });
      } else if (line.startsWith('> ')) {
        blocks.push({
          id: nanoid(),
          type: "quote",
          text: line.substring(2).trim(),
        });
      } else if (line.trim() === '---') {
        blocks.push({
          id: nanoid(),
          type: "divider",
        });
      } else if (line.trim()) {
        blocks.push({
          id: nanoid(),
          type: "paragraph",
          text: line.trim(),
        });
      }
    }

    // Create the page
    useDocsStore.getState().actions.createPage(
      useDocsStore.getState().state.rootFolderId,
      "Imported Document"
    );

    // Update blocks
    const state = useDocsStore.getState();
    state.actions.updatePageContent(pageId, blocks);

    return pageId;
  }
}

export const cmsService = new CMSService();