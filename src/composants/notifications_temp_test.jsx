
import { Button, Stack } from "@mui/material";
import { useToast } from "../hooks/toast_notifs_hooks";
import { ToastProvider } from "./notifications";

function AppContent() {
  const { addToast } = useToast();

  return (
    <div style={{ padding: 20 }}>
      <h1>Hello</h1>
      <Stack spacing={2} direction="row" style={{ marginTop: 20 }}>
        <Button
          variant="contained"
          color="success"
          onClick={() => addToast("Opération réussie !", "success")}
        >
          Success
        </Button>
        <Button
          variant="contained"
          color="warning"
          onClick={() => addToast("Attention, vérifie ça !", "warning")}
        >
          Warning
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => addToast("Erreur critique !", "error")}
        >
          Danger
        </Button>
      </Stack>
    </div>
  );
}
function TestNotifs() {

  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  )
}
export default TestNotifs;