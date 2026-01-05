import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={styles.container}>
      <h1 style={styles.code}>404</h1>
      <p style={styles.message}>La page que vous recherchez n’existe pas.</p>

      <Link to="/" style={styles.link}>
        Retour à l’accueil
      </Link>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  code: {
    fontSize: "96px",
    fontWeight: "bold",
    margin: 0,
  },
  message: {
    fontSize: "18px",
    marginBottom: "20px",
  },
  link: {
    textDecoration: "none",
    fontSize: "16px",
    color: "#1976d2",
    fontWeight: 500,
  },
};
