export interface WindowEnv {
    SERVICE_URI: string;
    STORAGE_URI: string;
    SOCKET_URI: string;
    AUTH_URI: string;
}

declare global {
    interface Window {
        _env: WindowEnv;
    }
}
