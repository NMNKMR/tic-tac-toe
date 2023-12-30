const fbConfig = {
    apiKey: String(import.meta.env.VITE_FB_ApiKey),
    authDomain: String(import.meta.env.VITE_FB_AuthDomain),
    databaseURL: String(import.meta.env.VITE_FB_DatabaseURL),
    projectId: String(import.meta.env.VITE_FB_ProjectId),
    storageBucket: String(import.meta.env.VITE_FB_StorageBucket),
    messagingSenderId: String(import.meta.env.VITE_FB_MessagingSenderId),
    appId: String(import.meta.env.VITE_FB_AppId),
    measurementId: String(import.meta.env.VITE_FB_MeasurementId),
}

export {fbConfig};