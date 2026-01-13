import Navbar from "../../composants/navbar";
import DashboardHome from "../../composants/accueil";
import Sidebar from "../../composants/sidebar";
import ChartList from "../../composants/ChartList";

const HomeCom = () => {
    return (

        <div className="d-flex">
            <div style={{ width: "8%" }}>
                <Sidebar />
            </div>
            <div style={{ width: "92%"}}>
                <Navbar />
                <div className="d-flex">
                    
                    <div style={{ width:"40%"}}>
                        <ChartList/>
                    </div>
                    <div style={{ width: "60%" }}>
                
                        <DashboardHome />
                    </div>
                </div>
                
            </div>

           
        </div>


    )
}
export default HomeCom;