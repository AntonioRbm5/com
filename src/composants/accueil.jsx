
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
        { icon: <FaUser />, label: "Liste des clients" },
        { icon: <FaFolderPlus />, label: "Saisir un document de vente" },
        { icon: <FaPlus />, label: "Relevés d'échéances clients" },
        { icon: <FaClipboardList />, label: "Gestion des comptes clients" },
        
      ],
    },
    {
      title: "Gestion des Achats",
      items: [
        { icon: <FaUser />, label: "Liste des fournisseurs" },
        { icon: <FaFolderPlus />, label: "Saisir un document d'achat" },
        { icon: <FaPlus />, label: "Saisir un règlement fournisseur" },
        { icon: <FaClipboardList />, label: "Gestion des comptes fournisseurs" },
      ],
    },
    {
      title: "Gestion des Stocks",
      items: [
        { icon: <FaBox />, label: "Liste des articles" },
        { icon: <FaFolderPlus />, label: "Saisir un document de stock" },
        { icon: <FaClipboardList />, label: "Gestion des comptes articles" },
        { icon: <FaPrint />, label: "Livre d'inventaire" },
      ],
    }
  ];

  return (
    <Container className="mt-4">
      {sections.map((section, idx) => (
        <div key={idx} className="mb-5">
          <h4 className="mb-3">{section.title}</h4>
          <Row>
            {section.items.map((item, i) => (
              <Col key={i} xs={6} md={3} lg={2} className="mb-3">
                <Card className="text-center h-100">
                  <Card.Body>
                    <div className="mb-2" style={{ fontSize: "2rem" }}>
                      {item.icon}
                    </div>
                    <Card.Text style={{ fontSize: "0.9rem" }}>{item.label}</Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <Button variant="primary" size="sm">
                      Ouvrir
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ))}
    </Container>
  );
};

export default DashboardHome;
