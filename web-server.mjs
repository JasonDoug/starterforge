#!/usr/bin/env node

import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { StarterForgeConfigSchema } from './starterforge.config.schema.js';
import { spawn } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'web')));

// Serve the main wizard page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'web', 'index.html'));
});

// API endpoint to generate project
app.post('/api/generate', async (req, res) => {
    try {
        console.log('🚀 Received generation request:', JSON.stringify(req.body, null, 2));
        
        // Validate configuration
        const config = StarterForgeConfigSchema.parse(req.body);
        
        // Generate unique timestamp for this request
        const timestamp = Date.now();
        const dateStr = new Date(timestamp).toISOString().replace(/[:.]/g, '-').slice(0, -5); // 2024-01-01T12-30-45
        const configFileName = `temp-config-${timestamp}.json`;
        const configFilePath = path.join(__dirname, configFileName);
        
        // Write config to temporary file
        fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));
        
        // Run the CLI tool with timestamped output directory
        const cliProcess = spawn('node', ['starterforge-cli.mjs', configFileName, '--output-dir', `output/${dateStr}`], {
            cwd: __dirname,
            stdio: 'pipe'
        });
        
        let output = '';
        let error = '';
        
        cliProcess.stdout.on('data', (data) => {
            output += data.toString();
            console.log('CLI Output:', data.toString());
        });
        
        cliProcess.stderr.on('data', (data) => {
            error += data.toString();
            console.error('CLI Error:', data.toString());
        });
        
        cliProcess.on('close', (code) => {
            // Clean up temporary config file
            try {
                fs.unlinkSync(configFilePath);
            } catch (e) {
                console.warn('Failed to clean up temp file:', e.message);
            }
            
            if (code === 0) {
                // Success - find the generated output directory
                const outputDir = path.join(__dirname, 'output', dateStr, config.project_type);
                
                if (fs.existsSync(outputDir)) {
                    console.log('✅ Project generated successfully at:', outputDir);
                    
                    // For now, just return success message with path
                    // In production, you'd want to create a zip file and return download URL
                    res.json({
                        success: true,
                        message: `Project generated successfully!\\n\\nGenerated at: ${dateStr}\\nProject Type: ${config.project_type}\\n\\nFiles are organized in timestamped directories to avoid conflicts.`,
                        outputPath: outputDir,
                        timestamp: dateStr,
                        files: getDirectoryStructure(outputDir)
                    });
                } else {
                    throw new Error('Output directory not found after generation');
                }
            } else {
                console.error('❌ CLI process failed with code:', code);
                res.status(500).json({
                    success: false,
                    error: 'Project generation failed',
                    details: error || output,
                    code: code
                });
            }
        });
        
        cliProcess.on('error', (err) => {
            console.error('❌ Failed to start CLI process:', err);
            
            // Clean up temporary config file
            try {
                fs.unlinkSync(configFilePath);
            } catch (e) {
                console.warn('Failed to clean up temp file:', e.message);
            }
            
            res.status(500).json({
                success: false,
                error: 'Failed to start generation process',
                details: err.message
            });
        });
        
    } catch (err) {
        console.error('❌ Generation error:', err);
        
        if (err.name === 'ZodError') {
            res.status(400).json({
                success: false,
                error: 'Invalid configuration',
                details: err.errors
            });
        } else {
            res.status(500).json({
                success: false,
                error: 'Server error',
                details: err.message
            });
        }
    }
});

// API endpoint to get project structure preview (latest generation)
app.get('/api/preview/:projectType', (req, res) => {
    const { projectType } = req.params;
    const outputBaseDir = path.join(__dirname, 'output');
    
    if (!fs.existsSync(outputBaseDir)) {
        return res.status(404).json({
            success: false,
            error: 'No projects generated yet'
        });
    }
    
    // Find the most recent generation
    try {
        const timestamps = fs.readdirSync(outputBaseDir, { withFileTypes: true })
            .filter(item => item.isDirectory())
            .map(item => item.name)
            .sort()
            .reverse(); // Most recent first
        
        for (const timestamp of timestamps) {
            const outputDir = path.join(outputBaseDir, timestamp, projectType);
            if (fs.existsSync(outputDir)) {
                const structure = getDirectoryStructure(outputDir);
                return res.json({
                    success: true,
                    structure: structure,
                    timestamp: timestamp
                });
            }
        }
        
        res.status(404).json({
            success: false,
            error: `No ${projectType} projects found`
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Error reading output directory',
            details: err.message
        });
    }
});

// API endpoint to list all generations
app.get('/api/generations', (req, res) => {
    const outputBaseDir = path.join(__dirname, 'output');
    
    if (!fs.existsSync(outputBaseDir)) {
        return res.json({
            success: true,
            generations: []
        });
    }
    
    try {
        const generations = fs.readdirSync(outputBaseDir, { withFileTypes: true })
            .filter(item => item.isDirectory())
            .map(item => {
                const timestamp = item.name;
                const timestampDir = path.join(outputBaseDir, timestamp);
                const projectTypes = fs.readdirSync(timestampDir, { withFileTypes: true })
                    .filter(subItem => subItem.isDirectory())
                    .map(subItem => subItem.name);
                
                return {
                    timestamp,
                    date: new Date(timestamp.replace(/-/g, ':').replace('T', 'T') + 'Z').toLocaleString(),
                    projectTypes
                };
            })
            .sort((a, b) => b.timestamp.localeCompare(a.timestamp)); // Most recent first
        
        res.json({
            success: true,
            generations
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Error reading generations',
            details: err.message
        });
    }
});

// Utility function to get directory structure
function getDirectoryStructure(dirPath, maxDepth = 3, currentDepth = 0) {
    if (currentDepth >= maxDepth) return [];
    
    try {
        const items = fs.readdirSync(dirPath, { withFileTypes: true });
        return items.map(item => {
            const itemPath = path.join(dirPath, item.name);
            const relativePath = path.relative(__dirname, itemPath);
            
            if (item.isDirectory()) {
                return {
                    name: item.name,
                    type: 'directory',
                    path: relativePath,
                    children: getDirectoryStructure(itemPath, maxDepth, currentDepth + 1)
                };
            } else {
                return {
                    name: item.name,
                    type: 'file',
                    path: relativePath,
                    size: fs.statSync(itemPath).size
                };
            }
        });
    } catch (err) {
        console.error('Error reading directory:', dirPath, err.message);
        return [];
    }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'StarterForge API is running',
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🌐 StarterForge Web Server running at http://localhost:${PORT}`);
    console.log(`📁 Serving static files from: ${path.join(__dirname, 'web')}`);
    console.log(`🔧 CLI tool available at: ${path.join(__dirname, 'starterforge-cli.mjs')}`);
    console.log('');
    console.log('Available endpoints:');
    console.log('  GET  /              - Web wizard interface');
    console.log('  POST /api/generate  - Generate project from config');
    console.log('  GET  /api/preview/:projectType - Get project structure');
    console.log('  GET  /api/health    - Health check');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🔄 Received SIGTERM, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🔄 Received SIGINT, shutting down gracefully');
    process.exit(0);
});