module.exports = {

"[project]/.next-internal/server/app/api/result/[jobId]/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
}}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[project]/app/api/result/[jobId]/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "GET": (()=>GET)
});
const API_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;
// Error logging utility
function logError(error, context, requestId) {
    const errorData = {
        timestamp: new Date().toISOString(),
        context,
        requestId,
        error: error instanceof Error ? {
            message: error.message,
            stack: error.stack,
            name: error.name
        } : error
    };
    console.error('[API_ERROR]', JSON.stringify(errorData, null, 2));
}
function generateRequestId() {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
async function GET(request, context) {
    const requestId = generateRequestId();
    try {
        const { jobId } = await context.params;
        // Validate jobId
        if (!jobId || !/^[a-zA-Z0-9\-]+$/.test(jobId)) {
            logError({
                invalidJobId: jobId
            }, 'Job ID validation', requestId);
            // For SSE, we need to send an error event
            const encoder = new TextEncoder();
            const stream = new ReadableStream({
                start (controller) {
                    const errorData = JSON.stringify({
                        error: 'Invalid job ID'
                    });
                    controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
                    controller.close();
                }
            });
            return new Response(stream, {
                headers: {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive'
                }
            });
        }
        // Connect to backend SSE endpoint
        const backendUrl = `${API_URL}/api/stream/${jobId}`;
        const response = await fetch(backendUrl, {
            method: 'GET',
            headers: {
                'X-API-Key': API_KEY || '',
                'X-Request-ID': requestId,
                'Accept': 'text/event-stream'
            }
        });
        if (!response.ok) {
            logError({
                status: response.status,
                statusText: response.statusText,
                jobId
            }, 'SSE connection error', requestId);
            // Send error as SSE event
            const encoder = new TextEncoder();
            const stream = new ReadableStream({
                start (controller) {
                    const errorData = JSON.stringify({
                        error: 'Failed to connect to execution service'
                    });
                    controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
                    controller.close();
                }
            });
            return new Response(stream, {
                headers: {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive'
                }
            });
        }
        // Stream the response from backend to client
        return new Response(response.body, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'X-Accel-Buffering': 'no'
            }
        });
    } catch (error) {
        logError(error, 'SSE proxy unhandled exception', requestId);
        // Send error as SSE event
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            start (controller) {
                const errorData = JSON.stringify({
                    error: 'Internal server error'
                });
                controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
                controller.close();
            }
        });
        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive'
            }
        });
    }
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__402ff06c._.js.map