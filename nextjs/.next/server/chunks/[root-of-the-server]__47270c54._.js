module.exports = {

"[project]/.next-internal/server/app/api/code/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

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
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}}),
"[project]/app/lib/logging.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/**
 * Logging utilities for API routes
 *
 * Provides centralized error logging with structured data
 */ __turbopack_context__.s({
    "generateRequestId": (()=>generateRequestId),
    "logError": (()=>logError)
});
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
    // In production, this would send to a logging service like Sentry, CloudWatch, etc.
    // For now, we log to console (can be enabled/disabled via env var)
    if (process.env.ENABLE_API_LOGGING === 'true') {
        console.error('[API_ERROR]', JSON.stringify(errorData, null, 2));
    }
}
function generateRequestId() {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
}}),
"[project]/app/api/code/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "POST": (()=>POST)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$logging$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/logging.ts [app-route] (ecmascript)");
;
;
// Keys
const API_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || [];
// CSRF Protection
function validateCSRF(request) {
    // Check for custom header to prevent simple form submissions
    const customHeader = request.headers.get('x-requested-with');
    if (customHeader !== 'XMLHttpRequest' && customHeader !== 'fetch') {
        return {
            valid: false,
            error: 'Missing required security header'
        };
    }
    // Validate origin in production
    if (("TURBOPACK compile-time value", "development") === 'production' && ALLOWED_ORIGINS.length > 0) {
        "TURBOPACK unreachable";
    }
    return {
        valid: true
    };
}
async function POST(request) {
    const requestId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$logging$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateRequestId"])();
    try {
        // CSRF Protection
        const csrfCheck = validateCSRF(request);
        if (!csrfCheck.valid) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$logging$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])(new Error(csrfCheck.error), 'CSRF validation', requestId);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Security validation failed',
                requestId
            }, {
                status: 403
            });
        }
        // Environment setup
        if (!API_URL || !API_KEY) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$logging$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])(new Error('Environment variables missing or incorrect.'), 'Environment validation', requestId);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Server configuration error',
                requestId
            }, {
                status: 500
            });
        }
        // Request body
        let body;
        try {
            body = await request.json();
        } catch (parseError) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$logging$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])(parseError, 'Request parsing', requestId);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Invalid request format',
                requestId
            }, {
                status: 400
            });
        }
        // Required fields
        if (!body.code || !body.language || !body.filename) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$logging$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])({
                missingFields: {
                    code: !body.code,
                    language: !body.language,
                    filename: !body.filename
                }
            }, 'Field validation', requestId);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Missing required fields',
                requestId
            }, {
                status: 400
            });
        }
        // Forward the request to API
        const response = await fetch(`${API_URL}/api/submit_code`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY,
                'X-Request-ID': requestId
            },
            body: JSON.stringify(body)
        });
        // Handle API response
        if (!response.ok) {
            // Get error details for logging
            const errorText = await response.text();
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$logging$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])({
                status: response.status,
                statusText: response.statusText,
                responseBody: errorText
            }, 'Backend API error', requestId);
            // Generic errors for client
            switch(response.status){
                case 400:
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        error: 'Invalid code submission',
                        requestId
                    }, {
                        status: 400
                    });
                case 401:
                case 403:
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        error: 'Authentication failed',
                        requestId
                    }, {
                        status: 403
                    });
                case 429:
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        error: 'Rate limit exceeded. Please try again later.',
                        requestId
                    }, {
                        status: 429
                    });
                default:
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        error: 'Service temporarily unavailable',
                        requestId
                    }, {
                        status: 500
                    });
            }
        }
        // Parse successful response
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            try {
                const data = await response.json();
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    ...data,
                    requestId
                }, {
                    status: response.status
                });
            } catch (jsonError) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$logging$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])(jsonError, 'Response JSON parsing', requestId);
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: 'Invalid response format',
                    requestId
                }, {
                    status: 500
                });
            }
        } else {
            const text = await response.text();
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$logging$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])({
                contentType,
                response: text
            }, 'Unexpected response format', requestId);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Service error',
                requestId
            }, {
                status: 500
            });
        }
    } catch (error) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$logging$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])(error, 'Unhandled exception', requestId);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal server error',
            requestId
        }, {
            status: 500
        });
    }
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__47270c54._.js.map