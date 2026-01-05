
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { 
  FaUser, 
  FaShoppingCart, 
  FaPlus, 
  FaClipboardList, 
  FaPrint, 
  FaBox, 
  FaCalendarAlt, 
  FaCog,
  FaChartLine,   // <-- ajouté
  FaFolder       // <-- ajouté
} from "react-icons/fa";


const DashboardHome = () => {
  const sections = [
    {
      title: "Gestion des Ventes",
      items: [
        { icon: <FaUser />, label: "Liste des clients" },
        { icon: <FaShoppingCart />, label: "Liste des documents de vente" },
        { icon: <FaPlus />, label: "Saisir un document de vente" },
        { icon: <FaClipboardList />, label: "Gestion des comptes clients" },
        { icon: <FaClipboardList />, label: "Recherche de lignes de documents" },
        { icon: <FaPrint />, label: "Relevés d'échéances clients" },
      ],
    },
    {
      title: "Gestion des Achats",
      items: [
        { icon: <FaUser />, label: "Liste des fournisseurs" },
        { icon: <FaShoppingCart />, label: "Liste des documents d'achat" },
        { icon: <FaPlus />, label: "Saisir un document d'achat" },
        { icon: <FaClipboardList />, label: "Gestion des comptes fournisseurs" },
      ],
    },
    {
      title: "Gestion des Stocks",
      items: [
        { icon: <FaBox />, label: "Liste des articles" },
        { icon: <FaPlus />, label: "Saisir un document de stock" },
        { icon: <FaClipboardList />, label: "Gestion des comptes articles" },
        { icon: <FaPrint />, label: "Livre d'inventaire" },
        { icon: <FaBox />, label: "Colonnage" },
      ],
    },
    {
      title: "Gestion des Prestations de Service",
      items: [
        { icon: <FaClipboardList />, label: "Liste des documents internes" },
        { icon: <FaUser />, label: "Liste des ressources" },
        { icon: <FaCalendarAlt />, label: "Réservation planning" },
      ],
    },
    {
      title: "Gestion de la Fabrication",
      items: [
        { icon: <FaBox />, label: "Liste nomenclatures" },
        { icon: <FaClipboardList />, label: "Liste des documents de fabrication" },
        { icon: <FaChartLine />, label: "Simulation de fabrication" },
        { icon: <FaFolder />, label: "ETATS STANDARDS - Raccourci" },
      ],
    },
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
