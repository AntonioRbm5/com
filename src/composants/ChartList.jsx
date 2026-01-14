import { Container, Row, Col, Card } from "react-bootstrap";
import DoughnutChart from "./DoughnutChart";
import PieChart from "./PieChart";

const ChartList = () => {
  const doughnutData = {
    labels: ["Ventes", "Achats", "Stocks"],
    data: [300, 150, 100],
    colors: ["#0d6efd", "#198754", "#fd7e14"],
  };

  const pieData = {
    labels: ["Articles", "Clients", "Fournisseurs"],
    data: [50, 30, 20],
    colors: ["#6f42c1", "#0d6efd", "#fd7e14"],
  };

  return (
    <Container className="mt-2">
      <Row className="justify-content-center">
        {/* Doughnut */}
        <Col xs={12} md={8} className="mb-4">
          <Card className="shadow-sm rounded-3 h-100">
            <Card.Body>
              {/* <h5 className="mb-2 text-center">Répartition générale (Doughnut)</h5> */}
              <DoughnutChart
                labels={doughnutData.labels}
                data={doughnutData.data}
                colors={doughnutData.colors}
                title="Dashboard Doughnut"
              />
            </Card.Body>
          </Card>
        </Col>

        {/* Pie */}
        <Col xs={12} md={8} className="mb-4">
          <Card className="shadow-sm rounded-3 h-100">
            <Card.Body>
              {/* <h5 className="mb-3 text-center">Répartition détaillée (Pie)</h5> */}
              <PieChart
                labels={pieData.labels}
                data={pieData.data}
                colors={pieData.colors}
                title="Dashboard Pie"
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ChartList;
