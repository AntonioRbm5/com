import Navbar from "../../composants/navbar";
import DashboardHome from "../../composants/accueil";
import Sidebar from "../../composants/sidebar";

const HomeCom = () => {
    return (

        <div className="d-flex">
            <div style={{ width: "20%" }}>
                <Sidebar />
            </div>
            <div style={{ width: "80%" }}>
                <Navbar />
                <DashboardHome />
            </div>
        </div>


    )
}
export default HomeCom;