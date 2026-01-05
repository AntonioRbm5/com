import { useState, useCallback } from "react";
import { Snackbar, Alert } from "@mui/material";
import { ToastContext } from "../constants/config";



export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, severity = "success", duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, severity, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {toasts.map(({ id, message, severity, duration }) => (
        <Snackbar
          key={id}
          open={true}
          autoHideDuration={duration}
          onClose={() => removeToast(id)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          sx={{ mt: 1 }}
        >
          <Alert
            onClose={() => removeToast(id)}
            severity={severity}
            variant="filled"
            sx={{
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              borderRadius: 2,
              minWidth: 250,
              fontSize: 14,
            }}
          >
            {message}
          </Alert>
        </Snackbar>
      ))}
    </ToastContext.Provider>
  );
};
