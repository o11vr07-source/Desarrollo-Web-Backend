type Props = {
    open: boolean;
    title?: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
  };
  
  export default function ConfirmModal({
    open,
    title = "Confirmación",
    message,
    onConfirm,
    onCancel,
  }: Props) {
    if (!open) return null;
  
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: 20,
            borderRadius: 8,
            width: 400,
            maxWidth: "90%",
          }}
        >
          <h4>{title}</h4>
  
          <p>{message}</p>
  
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button onClick={onCancel}>
              Cancelar
            </button>
  
            <button
              onClick={onConfirm}
              style={{ background: "red", color: "white" }}
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    );
  }