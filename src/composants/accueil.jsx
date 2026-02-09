import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { 
  FaUser, 
  FaPlus, 
  FaClipboardList, 
  FaPrint, 
  FaBox, 
  FaFolderPlus,
} from "react-icons/fa";

const DashboardHome = () => {
  const sections = [
    {
      title: "Gestion des Ventes",
      items: [
        { icon: <FaUser />, label: "Liste des clients", color: "#6f42c1" },
        { icon: <FaFolderPlus />, label: "Saisir un document de vente", color: "#0d6efd" },
        { icon: <FaPlus />, label: "Relevés d'échéances clients", color: "#198754" },
        { icon: <FaClipboardList />, label: "Gestion des comptes clients", color: "#fd7e14" },
      ],
    },
    {
      title: "Gestion des Achats",
      items: [
        { icon: <FaUser />, label: "Liste des fournisseurs", color: "#6f42c1" },
        { icon: <FaFolderPlus />, label: "Saisir un document d'achat", color: "#0d6efd" },
        { icon: <FaPlus />, label: "Saisir un règlement fournisseur", color: "#198754" },
        { icon: <FaClipboardList />, label: "Gestion des comptes fournisseurs", color: "#fd7e14" },
      ],
    },
    {
      title: "Gestion des Stocks",
      items: [
        { icon: <FaBox />, label: "Liste des articles", color: "#6f42c1" },
        { icon: <FaFolderPlus />, label: "Saisir un document de stock", color: "#0d6efd" },
        { icon: <FaClipboardList />, label: "Gestion des comptes articles", color: "#198754" },
        { icon: <FaPrint />, label: "Livre d'inventaire", color: "#fd7e14" },
      ],
    },
  ];

  return (
    <Container className="mt-4">
      {sections.map((section, idx) => (
        <div key={idx} className="mb-5">
          <h6 className="mb-2 text-primary">{section.title}</h6>
          <Row>
            {section.items.map((item, i) => (
              <Col key={i} xs={6} md={3} lg={2} className="mb-4">
                <Card className="text-center h-100 shadow-sm border-0 rounded-3 hover-card">
                  <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                    <div
                      className="mb-1 icon-circle d-flex align-items-center justify-content-center"
                      style={{
                        fontSize: "1rem",
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        backgroundColor: item.color,
                        color: "white",
                        transition: "transform 0.3s",
                      }}
                    >
                      {item.icon}
                    </div>
                    <Card.Text
                      style={{ fontSize: "0.75rem", fontWeight: 500 }}
                    >
                      {item.label}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer className="bg-white border-0 text-center">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="rounded-pill px-4"
                    >
                      Ouvrir
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ))}

      <style jsx>{`
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
        }
        .hover-card:hover .icon-circle {
          transform: scale(1.2);
        }
      `}</style>
    </Container>
  );
};

export default DashboardHome;
