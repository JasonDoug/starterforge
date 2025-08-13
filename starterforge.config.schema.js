import { z } from "zod";

// Project Type
const ProjectTypeEnum = z.enum([
  "web_app",
  "frontend_only",
  "backend_only",
  "cli_tool",
  "browser_extension",
  "microservice",
  "custom"
]);

// Frontend
const FrontendSchema = z.object({
  framework: z.string().optional(), // react, vue, etc.
  ui_libraries: z.array(z.string()).optional()
});

// Backend
const BackendSchema = z.object({
  language: z.string().optional(), // python, node, etc.
  framework: z.string().optional(),
  features: z.array(z.string()).optional() // rest_api, graphql, etc.
});

// Database
const DatabaseSchema = z.object({
  engines: z.array(z.string()).optional(),
  orm: z.string().optional(),
  cloud_hosted: z.boolean().optional(),
  models: z.array(z.string()).optional()
});

// Auth
const AuthSchema = z.object({
  provider: z.string().optional(),
  features: z.array(z.string()).optional(),
  include_ui: z.boolean().optional()
});

// DevOps
const DevOpsSchema = z.object({
  deployment_targets: z.array(z.string()).optional(),
  ci_cd: z.boolean().optional(),
  docker: z.object({
    enabled: z.boolean(),
    compose: z.boolean().optional()
  }).optional()
});

// Optional Features
const OptionalFeatureSchema = z.object({
  feature: z.string(),
  tool: z.string().optional(),
  include_demo: z.boolean().optional()
});

// Output Preferences
const OutputSchema = z.object({
  format: z.array(z.string()),
  repo: z
    .object({
      name: z.string(),
      visibility: z.enum(["public", "private"])
    })
    .optional()
});

// Root Config Schema
export const StarterForgeConfigSchema = z.object({
  project_type: ProjectTypeEnum,
  frontend: FrontendSchema.optional(),
  backend: BackendSchema.optional(),
  database: DatabaseSchema.optional(),
  auth: AuthSchema.optional(),
  devops: DevOpsSchema.optional(),
  optional_features: z.array(OptionalFeatureSchema).optional(),
  output: OutputSchema
});

// export type StarterForgeConfig = z.infer<typeof StarterForgeConfigSchema>;