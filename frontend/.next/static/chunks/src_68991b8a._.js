(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/core/api.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "api": ()=>api,
    "createTask": ()=>createTask,
    "deleteTask": ()=>deleteTask,
    "getNotifications": ()=>getNotifications,
    "getTask": ()=>getTask,
    "getTasks": ()=>getTasks,
    "login": ()=>login,
    "logout": ()=>logout,
    "register": ()=>register,
    "safeApiCall": ()=>safeApiCall,
    "updateTask": ()=>updateTask,
    "verifyToken": ()=>verifyToken
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
const API_BASE_URL = ("TURBOPACK compile-time value", "http://localhost:8000/api") || "http://localhost:8000/api";
const api = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: API_BASE_URL
});
// Axios interceptors for logging and token injection
api.interceptors.request.use((config)=>{
    var _config_method;
    // Attach token except for login and register
    const noAuthRoutes = [
        "/auth/login/",
        "/auth/register/"
    ];
    let urlPath = "";
    try {
        // Always resolve the full URL to get the pathname
        const urlObj = new URL(config.url, config.baseURL || window.location.origin);
        urlPath = urlObj.pathname;
    } catch (e) {
        urlPath = config.url || "";
    }
    // Ensure path always starts with /api for backend match
    const isNoAuth = noAuthRoutes.includes(urlPath);
    if (!isNoAuth) {
        const token = ("TURBOPACK compile-time truthy", 1) ? localStorage.getItem("token") : "TURBOPACK unreachable";
        if (token) {
            config.headers = config.headers || {};
            config.headers["Authorization"] = "Token ".concat(token);
        }
    }
    console.log("[API REQUEST] ".concat((_config_method = config.method) === null || _config_method === void 0 ? void 0 : _config_method.toUpperCase(), " ").concat(config.url), config);
    return config;
}, (error)=>{
    console.error("[API REQUEST ERROR]", error);
    return Promise.reject(error);
});
api.interceptors.response.use((response)=>{
    console.log("[API RESPONSE] ".concat(response.config.url), response);
    return response;
}, (error)=>{
    if (error.response) {
        console.error("[API RESPONSE ERROR] ".concat(error.response.config.url), error.response);
    } else {
        console.error("[API RESPONSE ERROR]", error);
    }
    return Promise.reject(error);
});
async function safeApiCall(fn) {
    try {
        return await fn();
    } catch (error) {
        // Optionally, show a toast or notification here
        return null;
    }
}
const login = (data)=>api.post("/auth/login/", data);
const logout = ()=>api.post("/auth/logout/");
const verifyToken = ()=>api.get("/auth/verify/");
const register = (data)=>api.post("/auth/register/", data);
const getTasks = (filters)=>api.get("/tasks/", {
        params: filters
    });
const createTask = (data)=>api.post("/tasks/", data);
const getTask = (id)=>api.get("/tasks/".concat(id, "/"));
const updateTask = (id, data)=>api.put("/tasks/".concat(id, "/"), data);
const deleteTask = (id)=>api.delete("/tasks/".concat(id, "/"));
const getNotifications = ()=>api.get("/notifications/");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/auth/components/LogoutButton.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>LogoutButton
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/core/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function LogoutButton() {
    let { onLoggedOut } = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    _s();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    // Watch for token removal (manual/localStorage clear)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LogoutButton.useEffect": ()=>{
            const checkToken = {
                "LogoutButton.useEffect.checkToken": ()=>{
                    if (!localStorage.getItem("token") && onLoggedOut) {
                        onLoggedOut();
                    }
                }
            }["LogoutButton.useEffect.checkToken"];
            window.addEventListener("storage", checkToken);
            return ({
                "LogoutButton.useEffect": ()=>window.removeEventListener("storage", checkToken)
            })["LogoutButton.useEffect"];
        }
    }["LogoutButton.useEffect"], [
        onLoggedOut
    ]);
    const handleLogout = async ()=>{
        setLoading(true);
        setError("");
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logout"])();
            localStorage.removeItem("token");
            if (onLoggedOut) {
                onLoggedOut();
            } else {
                router.push("/auth");
            }
        } catch (err) {
            setError("Logout failed");
        } finally{
            setLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: handleLogout,
        className: "bg-gray-600 text-white rounded px-4 py-2",
        disabled: loading,
        children: loading ? "Logging out..." : "Logout"
    }, void 0, false, {
        fileName: "[project]/src/app/auth/components/LogoutButton.tsx",
        lineNumber: 42,
        columnNumber: 5
    }, this);
}
_s(LogoutButton, "jnApLEeAX1ZRgNW2YgBy3UCQLsk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = LogoutButton;
var _c;
__turbopack_context__.k.register(_c, "LogoutButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/components/AppHeader.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>AppHeader
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$auth$2f$components$2f$LogoutButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/auth/components/LogoutButton.tsx [app-client] (ecmascript)");
"use client";
;
;
function AppHeader() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "w-full flex justify-end p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$auth$2f$components$2f$LogoutButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
            fileName: "[project]/src/app/components/AppHeader.tsx",
            lineNumber: 7,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/components/AppHeader.tsx",
        lineNumber: 6,
        columnNumber: 5
    }, this);
}
_c = AppHeader;
var _c;
__turbopack_context__.k.register(_c, "AppHeader");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_68991b8a._.js.map