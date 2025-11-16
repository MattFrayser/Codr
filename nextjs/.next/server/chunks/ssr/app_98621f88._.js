module.exports = {

"[project]/app/components/CodeEditor.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/**
 * Code Editor Component
 *
 * Pure editor component that wraps Monaco Editor.
 * Handles only the code editing interface.
 */ __turbopack_context__.s({
    "CodeEditor": (()=>CodeEditor)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@monaco-editor/react'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
"use client";
;
;
function CodeEditor({ code, language, theme, onChange, editorOptions }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex-grow",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Editor, {
            height: "50vh",
            defaultLanguage: "python",
            language: language.toLowerCase(),
            theme: theme,
            value: code,
            onChange: onChange,
            options: editorOptions
        }, void 0, false, {
            fileName: "[project]/app/components/CodeEditor.tsx",
            lineNumber: 29,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/CodeEditor.tsx",
        lineNumber: 28,
        columnNumber: 5
    }, this);
}
}}),
"[project]/app/components/InteractiveTerminalOutput.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/**
 * Interactive Terminal Output Component
 *
 * Displays code execution output with real-time streaming and interactive input support
 */ __turbopack_context__.s({
    "InteractiveTerminalOutput": (()=>InteractiveTerminalOutput)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
function InteractiveTerminalOutput({ outputLines, isExecuting, onRun, onSendInput }) {
    const [inputValue, setInputValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const outputEndRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Auto-scroll to bottom when new output arrives
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        outputEndRef.current?.scrollIntoView({
            behavior: 'smooth'
        });
    }, [
        outputLines
    ]);
    const handleInputSubmit = (e)=>{
        e.preventDefault();
        if (inputValue.trim()) {
            onSendInput(inputValue);
            setInputValue('');
        }
    };
    const getLineColor = (type)=>{
        switch(type){
            case 'stdout':
                return 'text-gray-300';
            case 'stderr':
                return 'text-red-400';
            case 'system':
                return 'text-blue-400';
            case 'input':
                return 'text-green-400';
            default:
                return 'text-gray-300';
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-56 bg-[#1e1e1e] border-t-10 border-[#0f0f0f] flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center border-b-10 border-[#0f0f0f] bg-[#0f0f0f]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: onRun,
                    className: "flex w-full",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "submit",
                            className: "flex items-center px-4 mx-4 py-1 text-sm bg-green-700 hover:bg-green-800 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed",
                            disabled: isExecuting,
                            children: isExecuting ? 'Running...' : 'Run'
                        }, void 0, false, {
                            fileName: "[project]/app/components/InteractiveTerminalOutput.tsx",
                            lineNumber: 62,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "flex-grow px-4 py-1 text-sm text-gray-500",
                            children: "Output"
                        }, void 0, false, {
                            fileName: "[project]/app/components/InteractiveTerminalOutput.tsx",
                            lineNumber: 69,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/InteractiveTerminalOutput.tsx",
                    lineNumber: 61,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/InteractiveTerminalOutput.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-auto p-4 text-sm",
                children: [
                    outputLines.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-gray-500",
                        children: "Run your code to see output here"
                    }, void 0, false, {
                        fileName: "[project]/app/components/InteractiveTerminalOutput.tsx",
                        lineNumber: 78,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            outputLines.map((line, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mb-1",
                                    children: line.type === 'input' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-gray-500 mr-2",
                                                children: ">"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/InteractiveTerminalOutput.tsx",
                                                lineNumber: 85,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                                className: `${getLineColor(line.type)} whitespace-pre-wrap font-mono text-sm`,
                                                children: line.content
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/InteractiveTerminalOutput.tsx",
                                                lineNumber: 86,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/InteractiveTerminalOutput.tsx",
                                        lineNumber: 84,
                                        columnNumber: 19
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                        className: `${getLineColor(line.type)} whitespace-pre-wrap font-mono text-sm`,
                                        children: line.content
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/InteractiveTerminalOutput.tsx",
                                        lineNumber: 91,
                                        columnNumber: 19
                                    }, this)
                                }, i, false, {
                                    fileName: "[project]/app/components/InteractiveTerminalOutput.tsx",
                                    lineNumber: 82,
                                    columnNumber: 15
                                }, this)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                ref: outputEndRef
                            }, void 0, false, {
                                fileName: "[project]/app/components/InteractiveTerminalOutput.tsx",
                                lineNumber: 97,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/InteractiveTerminalOutput.tsx",
                        lineNumber: 80,
                        columnNumber: 11
                    }, this),
                    isExecuting && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleInputSubmit,
                        className: "mt-2 flex items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-gray-500 mr-2",
                                children: ">"
                            }, void 0, false, {
                                fileName: "[project]/app/components/InteractiveTerminalOutput.tsx",
                                lineNumber: 104,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                ref: inputRef,
                                type: "text",
                                value: inputValue,
                                onChange: (e)=>setInputValue(e.target.value),
                                className: "flex-1 bg-[#2a2a2a] text-green-400 font-mono text-sm px-2 py-1 border border-gray-700 focus:outline-none focus:border-green-500",
                                placeholder: "Type input and press Enter..."
                            }, void 0, false, {
                                fileName: "[project]/app/components/InteractiveTerminalOutput.tsx",
                                lineNumber: 105,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                className: "ml-2 px-3 py-1 text-xs bg-green-700 hover:bg-green-800 text-white font-medium",
                                children: "Send"
                            }, void 0, false, {
                                fileName: "[project]/app/components/InteractiveTerminalOutput.tsx",
                                lineNumber: 113,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/InteractiveTerminalOutput.tsx",
                        lineNumber: 103,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/InteractiveTerminalOutput.tsx",
                lineNumber: 76,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/InteractiveTerminalOutput.tsx",
        lineNumber: 58,
        columnNumber: 5
    }, this);
}
}}),
"[project]/app/config/editorConfig.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/**
 * Editor Configuration
 *
 * Configuration for Monaco editor settings, themes, and options.
 */ __turbopack_context__.s({
    "DEFAULT_EDITOR_SETTINGS": (()=>DEFAULT_EDITOR_SETTINGS),
    "FONT_SIZE": (()=>FONT_SIZE),
    "TAB_SIZES": (()=>TAB_SIZES),
    "THEMES": (()=>THEMES),
    "adjustFontSize": (()=>adjustFontSize),
    "buildEditorOptions": (()=>buildEditorOptions),
    "toggleTheme": (()=>toggleTheme)
});
const DEFAULT_EDITOR_SETTINGS = {
    theme: "vs-dark",
    fontSize: 18,
    tabSize: 2,
    enableAutocomplete: true
};
const THEMES = {
    DARK: "vs-dark",
    LIGHT: "light"
};
const FONT_SIZE = {
    MIN: 8,
    MAX: 32,
    STEP: 2
};
const TAB_SIZES = [
    2,
    4,
    8
];
function buildEditorOptions(settings) {
    return {
        minimap: {
            enabled: false
        },
        fontSize: settings.fontSize,
        lineNumbers: "on",
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: settings.tabSize,
        wordWrap: "on",
        suggestOnTriggerCharacters: settings.enableAutocomplete,
        quickSuggestions: {
            other: settings.enableAutocomplete,
            comments: false,
            strings: settings.enableAutocomplete
        },
        wordBasedSuggestions: settings.enableAutocomplete ? 'currentDocument' : 'off'
    };
}
function toggleTheme(currentTheme) {
    return currentTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
}
function adjustFontSize(currentSize, direction) {
    if (direction === 'increase') {
        return Math.min(FONT_SIZE.MAX, currentSize + FONT_SIZE.STEP);
    } else {
        return Math.max(FONT_SIZE.MIN, currentSize - FONT_SIZE.STEP);
    }
}
}}),
"[project]/app/components/EditorSettings.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/**
 * Editor Settings Component
 *
 * Modal overlay for configuring editor settings.
 */ __turbopack_context__.s({
    "EditorSettings": (()=>EditorSettings)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$config$2f$editorConfig$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/config/editorConfig.ts [app-ssr] (ecmascript)");
"use client";
;
;
function EditorSettings({ isOpen, onClose, fontSize, onIncreaseFontSize, onDecreaseFontSize, tabSize, onTabSizeChange, enableAutocomplete, onAutocompleteToggle }) {
    if (!isOpen) return null;
    const handleApply = ()=>{
        // Settings are applied instantly through callbacks
        onClose();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 backdrop-blur-sm bg-opacity-40 flex items-center justify-center z-50",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-[#000000] rounded-lg shadow-xl w-96 border border-gray-700",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-between items-center p-4 border-b border-gray-700",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-white font-medium",
                            children: "Editor Settings"
                        }, void 0, false, {
                            fileName: "[project]/app/components/EditorSettings.tsx",
                            lineNumber: 46,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "text-gray-400 hover:text-white",
                            children: "✕"
                        }, void 0, false, {
                            fileName: "[project]/app/components/EditorSettings.tsx",
                            lineNumber: 47,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/EditorSettings.tsx",
                    lineNumber: 45,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-6 space-y-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-gray-300 text-sm",
                                    children: "Font Size"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/EditorSettings.tsx",
                                    lineNumber: 59,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: onDecreaseFontSize,
                                            className: "bg-[#3d3d3d] hover:bg-gray-600 text-white w-8 h-8 flex items-center justify-center rounded-l",
                                            children: "−"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/EditorSettings.tsx",
                                            lineNumber: 61,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-[#2d2d2d] text-white px-4 py-1 w-16 text-center",
                                            children: [
                                                fontSize,
                                                "px"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/EditorSettings.tsx",
                                            lineNumber: 67,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: onIncreaseFontSize,
                                            className: "bg-[#3d3d3d] hover:bg-gray-600 text-white w-8 h-8 flex items-center justify-center rounded-r",
                                            children: "+"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/EditorSettings.tsx",
                                            lineNumber: 70,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/EditorSettings.tsx",
                                    lineNumber: 60,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/EditorSettings.tsx",
                            lineNumber: 58,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-gray-300 text-sm",
                                    children: "Tab Size"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/EditorSettings.tsx",
                                    lineNumber: 81,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-[#3d3d3d] rounded overflow-hidden",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        className: "bg-[#3d3d3d] text-white w-full p-2 outline-none",
                                        value: tabSize,
                                        onChange: (e)=>onTabSizeChange(Number(e.target.value)),
                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$config$2f$editorConfig$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TAB_SIZES"].map((size)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: size,
                                                children: [
                                                    size,
                                                    " spaces"
                                                ]
                                            }, size, true, {
                                                fileName: "[project]/app/components/EditorSettings.tsx",
                                                lineNumber: 89,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/EditorSettings.tsx",
                                        lineNumber: 83,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/components/EditorSettings.tsx",
                                    lineNumber: 82,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/EditorSettings.tsx",
                            lineNumber: 80,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-gray-300 text-sm",
                                    children: "Autocomplete"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/EditorSettings.tsx",
                                    lineNumber: 99,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center cursor-pointer",
                                    onClick: ()=>onAutocompleteToggle(!enableAutocomplete),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `w-10 h-5 rounded-full flex items-center transition-colors duration-200 ease-in-out ${enableAutocomplete ? 'bg-blue-600' : 'bg-gray-600'}`,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `bg-white w-4 h-4 rounded-full shadow transform transition-transform duration-200 ease-in-out ${enableAutocomplete ? 'translate-x-5' : 'translate-x-1'}`
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/EditorSettings.tsx",
                                                lineNumber: 105,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/EditorSettings.tsx",
                                            lineNumber: 104,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "ml-2 text-gray-300 text-sm",
                                            children: enableAutocomplete ? 'Enabled' : 'Disabled'
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/EditorSettings.tsx",
                                            lineNumber: 107,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/EditorSettings.tsx",
                                    lineNumber: 100,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/EditorSettings.tsx",
                            lineNumber: 98,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/EditorSettings.tsx",
                    lineNumber: 56,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "border-t border-gray-700 p-4 flex justify-end space-x-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "px-4 py-2 rounded text-gray-300 hover:bg-gray-700",
                            onClick: onClose,
                            children: "Cancel"
                        }, void 0, false, {
                            fileName: "[project]/app/components/EditorSettings.tsx",
                            lineNumber: 116,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded",
                            onClick: handleApply,
                            children: "Apply"
                        }, void 0, false, {
                            fileName: "[project]/app/components/EditorSettings.tsx",
                            lineNumber: 122,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/EditorSettings.tsx",
                    lineNumber: 115,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/EditorSettings.tsx",
            lineNumber: 43,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/EditorSettings.tsx",
        lineNumber: 42,
        columnNumber: 5
    }, this);
}
}}),
"[project]/app/components/EditorToolbar.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/**
 * Editor Toolbar Component
 *
 * Action buttons for file operations, theme toggle, and settings.
 */ __turbopack_context__.s({
    "EditorToolbar": (()=>EditorToolbar)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$vsc$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/vsc/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$md$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/md/index.mjs [app-ssr] (ecmascript)");
"use client";
;
;
;
function EditorToolbar({ onDownload, onRestart, onShare, onToggleTheme, onToggleSettings }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex justify-between py-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex bg-[#3d3d3d] rounded p-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "p-2 hover:bg-gray-600 rounded",
                            onClick: onDownload,
                            title: "Download code",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$md$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MdOutlineFileDownload"], {}, void 0, false, {
                                fileName: "[project]/app/components/EditorToolbar.tsx",
                                lineNumber: 37,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/EditorToolbar.tsx",
                            lineNumber: 32,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "p-2 hover:bg-gray-600 rounded",
                            onClick: onRestart,
                            title: "Reset code",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$vsc$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VscDebugRestart"], {}, void 0, false, {
                                fileName: "[project]/app/components/EditorToolbar.tsx",
                                lineNumber: 44,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/EditorToolbar.tsx",
                            lineNumber: 39,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "p-2 hover:bg-gray-600 rounded",
                            onClick: onShare,
                            title: "Share code",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$vsc$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VscShare"], {}, void 0, false, {
                                fileName: "[project]/app/components/EditorToolbar.tsx",
                                lineNumber: 51,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/EditorToolbar.tsx",
                            lineNumber: 46,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/EditorToolbar.tsx",
                    lineNumber: 31,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/EditorToolbar.tsx",
                lineNumber: 30,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-[#3d3d3d] rounded",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "p-2 hover:bg-gray-600 rounded mr-1",
                            onClick: onToggleTheme,
                            children: "Theme"
                        }, void 0, false, {
                            fileName: "[project]/app/components/EditorToolbar.tsx",
                            lineNumber: 59,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "p-2 hover:bg-gray-600 rounded mr-1",
                            onClick: onToggleSettings,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$vsc$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VscSettingsGear"], {}, void 0, false, {
                                fileName: "[project]/app/components/EditorToolbar.tsx",
                                lineNumber: 69,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/EditorToolbar.tsx",
                            lineNumber: 65,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/EditorToolbar.tsx",
                    lineNumber: 58,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/EditorToolbar.tsx",
                lineNumber: 57,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/EditorToolbar.tsx",
        lineNumber: 28,
        columnNumber: 5
    }, this);
}
}}),
"[project]/app/hooks/useWebSocketExecution.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/**
 * WebSocket Code Execution Hook
 *
 * Handles real-time code execution with interactive input/output via WebSocket
 */ __turbopack_context__.s({
    "useWebSocketExecution": (()=>useWebSocketExecution)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
function useWebSocketExecution() {
    const [outputLines, setOutputLines] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isExecuting, setIsExecuting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const wsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    /**
   * Add output line to the display
   */ const addOutputLine = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((type, content)=>{
        setOutputLines((prev)=>[
                ...prev,
                {
                    type,
                    content,
                    timestamp: Date.now()
                }
            ]);
    }, []);
    /**
   * Send user input to PTY - industry standard approach
   */ const sendInput = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((input)=>{
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            // Send input directly to PTY (type changed from 'input_response' to 'input')
            wsRef.current.send(JSON.stringify({
                type: 'input',
                data: input + '\n'
            }));
            // Add user input to output display
            addOutputLine('input', input);
        }
    }, [
        addOutputLine
    ]);
    /**
   * Execute code via WebSocket
   */ const execute = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (code, language)=>{
        if (!code.trim()) {
            addOutputLine('system', 'Please enter some code');
            return;
        }
        // Clear previous output
        setOutputLines([]);
        setIsExecuting(true);
        addOutputLine('system', 'Connecting to execution service...');
        try {
            // Determine WebSocket protocol based on current location
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const host = window.location.host;
            // For development, connect directly to backend
            const isDev = ("TURBOPACK compile-time value", "development") === 'development';
            const wsUrl = ("TURBOPACK compile-time truthy", 1) ? 'ws://localhost:8000/ws/execute' : ("TURBOPACK unreachable", undefined);
            const ws = new WebSocket(wsUrl);
            wsRef.current = ws;
            // Connection opened
            ws.onopen = ()=>{
                addOutputLine('system', 'Connected! Starting execution...');
                // Send execute message
                ws.send(JSON.stringify({
                    type: 'execute',
                    code,
                    language
                }));
            };
            // Handle incoming messages
            ws.onmessage = (event)=>{
                try {
                    const message = JSON.parse(event.data);
                    switch(message.type){
                        case 'output':
                            // Real-time output from PTY
                            const stream = message.stream;
                            addOutputLine(stream, message.data);
                            break;
                        case 'complete':
                            // Execution completed
                            addOutputLine('system', `\nExecution completed in ${message.execution_time?.toFixed(3)}s (exit code: ${message.exit_code})`);
                            setIsExecuting(false);
                            ws.close();
                            break;
                        case 'error':
                            // Error occurred
                            addOutputLine('stderr', `Error: ${message.message}`);
                            setIsExecuting(false);
                            ws.close();
                            break;
                        default:
                            console.warn('Unknown message type:', message.type);
                    }
                } catch (err) {
                    console.error('Error parsing WebSocket message:', err);
                    addOutputLine('system', 'Error parsing server message');
                }
            };
            // Handle errors
            ws.onerror = (error)=>{
                console.error('WebSocket error:', error);
                addOutputLine('system', 'Connection error - please check your connection');
                setIsExecuting(false);
            };
            // Handle connection close
            ws.onclose = (event)=>{
                if (isExecuting) {
                    if (event.wasClean) {
                        console.log(`WebSocket closed cleanly, code=${event.code}, reason=${event.reason}`);
                    } else {
                        addOutputLine('system', 'Connection lost unexpectedly');
                    }
                }
                setIsExecuting(false);
                wsRef.current = null;
            };
        } catch (err) {
            addOutputLine('system', `Failed to connect: ${err.message}`);
            setIsExecuting(false);
        }
    }, [
        addOutputLine,
        isExecuting
    ]);
    /**
   * Clear all output
   */ const clearOutput = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setOutputLines([]);
        // Close WebSocket if open
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
    }, []);
    return {
        outputLines,
        isExecuting,
        execute,
        sendInput,
        clearOutput
    };
}
}}),
"[project]/app/hooks/useEditorSettings.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/**
 * Editor Settings Hook
 *
 * Manages all editor configuration including theme, font size, tab size, and autocomplete.
 */ __turbopack_context__.s({
    "useEditorSettings": (()=>useEditorSettings)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$config$2f$editorConfig$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/config/editorConfig.ts [app-ssr] (ecmascript)");
;
;
function useEditorSettings() {
    const [theme, setTheme] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$config$2f$editorConfig$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_EDITOR_SETTINGS"].theme);
    const [fontSize, setFontSize] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$config$2f$editorConfig$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_EDITOR_SETTINGS"].fontSize);
    const [tabSize, setTabSize] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$config$2f$editorConfig$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_EDITOR_SETTINGS"].tabSize);
    const [enableAutocomplete, setEnableAutocomplete] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$config$2f$editorConfig$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_EDITOR_SETTINGS"].enableAutocomplete);
    /**
   * Toggle between dark and light theme
   */ const toggleTheme = ()=>{
        setTheme((currentTheme)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$config$2f$editorConfig$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toggleTheme"])(currentTheme));
    };
    /**
   * Increase font size
   */ const increaseFontSize = ()=>{
        setFontSize((current)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$config$2f$editorConfig$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["adjustFontSize"])(current, 'increase'));
    };
    /**
   * Decrease font size
   */ const decreaseFontSize = ()=>{
        setFontSize((current)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$config$2f$editorConfig$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["adjustFontSize"])(current, 'decrease'));
    };
    // Build settings object
    const settings = {
        theme,
        fontSize,
        tabSize,
        enableAutocomplete
    };
    // Build Monaco editor options
    const editorOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$config$2f$editorConfig$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildEditorOptions"])(settings);
    return {
        settings,
        theme,
        fontSize,
        tabSize,
        enableAutocomplete,
        toggleTheme,
        increaseFontSize,
        decreaseFontSize,
        setTabSize,
        setEnableAutocomplete,
        editorOptions
    };
}
}}),
"[project]/app/config/languageConfig.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/**
 * Language Configuration
 *
 * Central configuration for all supported programming languages.
 * Includes language metadata, file extensions, and default code templates.
 */ __turbopack_context__.s({
    "DEFAULT_CODE": (()=>DEFAULT_CODE),
    "FILE_EXTENSIONS": (()=>FILE_EXTENSIONS),
    "SUPPORTED_LANGUAGES": (()=>SUPPORTED_LANGUAGES),
    "getDefaultCode": (()=>getDefaultCode),
    "getFileExtension": (()=>getFileExtension),
    "getLanguageLabel": (()=>getLanguageLabel),
    "isLanguageSupported": (()=>isLanguageSupported)
});
const SUPPORTED_LANGUAGES = [
    {
        value: "python",
        label: "Python"
    },
    {
        value: "javascript",
        label: "JavaScript"
    },
    {
        value: "cpp",
        label: "C++"
    },
    {
        value: "c",
        label: "C"
    },
    {
        value: "rust",
        label: "Rust"
    }
];
const FILE_EXTENSIONS = {
    python: ".py",
    javascript: ".js",
    cpp: ".cpp",
    c: ".c",
    rust: ".rs"
};
const DEFAULT_CODE = {
    python: '# Write your Python code here\nprint("Hello, World!")',
    javascript: '// Write your JavaScript code here\nconsole.log("Hello, World!");',
    cpp: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}',
    c: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}',
    rust: 'fn main() {\n    println!("Hello, World!");\n}'
};
function getFileExtension(language) {
    return FILE_EXTENSIONS[language] || ".txt";
}
function getDefaultCode(language) {
    return DEFAULT_CODE[language] || 'print("Hello, World!")';
}
function isLanguageSupported(language) {
    return language in FILE_EXTENSIONS;
}
function getLanguageLabel(languageValue) {
    const lang = SUPPORTED_LANGUAGES.find((l)=>l.value === languageValue);
    return lang?.label || languageValue;
}
}}),
"[project]/app/hooks/useFileOperations.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/**
 * File Operations Hook
 *
 * Handles file download and code reset operations.
 */ __turbopack_context__.s({
    "useFileOperations": (()=>useFileOperations)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$config$2f$languageConfig$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/config/languageConfig.ts [app-ssr] (ecmascript)");
;
function useFileOperations() {
    /**
   * Download the current code as a file
   */ const downloadFile = (code, filename)=>{
        const blob = new Blob([
            code
        ], {
            type: 'text/plain'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    /**
   * Reset code to default template for the current language
   */ const resetCode = (language, onCodeChange, onFilenameChange, onFileExtChange, onOutput)=>{
        const defaultLanguageCode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$config$2f$languageConfig$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDefaultCode"])(language);
        const fileExtension = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$config$2f$languageConfig$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getFileExtension"])(language);
        onCodeChange(defaultLanguageCode);
        onFilenameChange("main");
        onFileExtChange(fileExtension);
        onOutput("Code reset to default");
    };
    return {
        downloadFile,
        resetCode
    };
}
}}),
"[project]/app/components/ide.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>IDE)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CodeEditor$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/CodeEditor.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$InteractiveTerminalOutput$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/InteractiveTerminalOutput.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$EditorSettings$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/EditorSettings.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$EditorToolbar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/EditorToolbar.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$hooks$2f$useWebSocketExecution$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/hooks/useWebSocketExecution.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$hooks$2f$useEditorSettings$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/hooks/useEditorSettings.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$hooks$2f$useFileOperations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/hooks/useFileOperations.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$config$2f$languageConfig$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/config/languageConfig.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
;
function IDE() {
    const [code, setCode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('print("hello world")');
    const [language, setLanguage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("python");
    const [filename, setFilename] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("Main");
    const [fileExt, setFileExt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(".py");
    const [showSettings, setShowSettings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Custom hooks - delegate complex logic
    const { outputLines, isExecuting, execute, sendInput, clearOutput } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$hooks$2f$useWebSocketExecution$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWebSocketExecution"])();
    const { theme, fontSize, tabSize, enableAutocomplete, toggleTheme, increaseFontSize, decreaseFontSize, setTabSize, setEnableAutocomplete, editorOptions } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$hooks$2f$useEditorSettings$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEditorSettings"])();
    const { downloadFile, resetCode } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$hooks$2f$useFileOperations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useFileOperations"])();
    // Event handlers
    const handleChange = (value = "")=>{
        setCode(value);
    };
    const handleSubmit = async (e)=>{
        e.preventDefault();
        await execute(code, language);
    };
    const handleDownload = ()=>{
        const fullFilename = `${filename}${fileExt}`;
        downloadFile(code, fullFilename);
    };
    const handleRestart = ()=>{
        resetCode(language, setCode, setFilename, setFileExt, ()=>clearOutput());
    };
    const handleLanguageChange = (langValue)=>{
        setLanguage(langValue);
        setCode((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$config$2f$languageConfig$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDefaultCode"])(langValue));
        setFileExt((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$config$2f$languageConfig$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getFileExtension"])(langValue));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full max-w-6xl mx-auto my-4 rounded-lg overflow-hidden shadow-xl",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$EditorToolbar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EditorToolbar"], {
                onDownload: handleDownload,
                onRestart: handleRestart,
                onToggleTheme: toggleTheme,
                onToggleSettings: ()=>setShowSettings(!showSettings)
            }, void 0, false, {
                fileName: "[project]/app/components/ide.tsx",
                lineNumber: 80,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$EditorSettings$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EditorSettings"], {
                isOpen: showSettings,
                onClose: ()=>setShowSettings(false),
                fontSize: fontSize,
                onIncreaseFontSize: increaseFontSize,
                onDecreaseFontSize: decreaseFontSize,
                tabSize: tabSize,
                onTabSizeChange: setTabSize,
                enableAutocomplete: enableAutocomplete,
                onAutocompleteToggle: setEnableAutocomplete
            }, void 0, false, {
                fileName: "[project]/app/components/ide.tsx",
                lineNumber: 88,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between bg-[#1d1d1d]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-[#0f0f0f] py-2 px-4 rounded-t-lg flex items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                value: filename,
                                onChange: (e)=>setFilename(e.target.value),
                                className: "bg-transparent text-white outline-none w-32"
                            }, void 0, false, {
                                fileName: "[project]/app/components/ide.tsx",
                                lineNumber: 104,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-gray-400",
                                children: fileExt
                            }, void 0, false, {
                                fileName: "[project]/app/components/ide.tsx",
                                lineNumber: 110,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/ide.tsx",
                        lineNumber: 103,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center py-2 bg-[#1d1d1d]",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-[#3d3d3d] hover:bg-gray-600 rounded px-5 mx-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                className: "text-gray-200 outline-none bg-transparent",
                                value: language,
                                onChange: (e)=>handleLanguageChange(e.target.value),
                                children: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$config$2f$languageConfig$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SUPPORTED_LANGUAGES"].map((lang)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: lang.value,
                                        children: lang.label
                                    }, lang.value, false, {
                                        fileName: "[project]/app/components/ide.tsx",
                                        lineNumber: 122,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/components/ide.tsx",
                                lineNumber: 116,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/ide.tsx",
                            lineNumber: 115,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/ide.tsx",
                        lineNumber: 114,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/ide.tsx",
                lineNumber: 101,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CodeEditor$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CodeEditor"], {
                code: code,
                language: language,
                theme: theme,
                onChange: handleChange,
                editorOptions: editorOptions
            }, void 0, false, {
                fileName: "[project]/app/components/ide.tsx",
                lineNumber: 132,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$InteractiveTerminalOutput$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InteractiveTerminalOutput"], {
                outputLines: outputLines,
                isExecuting: isExecuting,
                onRun: handleSubmit,
                onSendInput: sendInput
            }, void 0, false, {
                fileName: "[project]/app/components/ide.tsx",
                lineNumber: 141,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/ide.tsx",
        lineNumber: 78,
        columnNumber: 5
    }, this);
}
}}),

};

//# sourceMappingURL=app_98621f88._.js.map