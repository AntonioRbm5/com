const T_Codification = () => {
    return (
        <div className="card mb-4 shadow-sm">
            <div className="card-header bg-light fw-semibold">
            Codification des comptes tiers
            </div>
            <div className="card-body">
                <table class="table">
                    <thead>
                        <tr>
                        <th scope="col">Type</th>
                        <th scope="col">Numérotisation</th>
                        <th scope="col">Longueur</th>
                        <th scope="col">Racine</th>
                        </tr>
                    </thead>
                <tbody>
                    <tr>
                        <th scope="row">1</th>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td>@mdo</td>
                    </tr>
                    <tr>
                        <th scope="row">2</th>
                        <td>Jacob</td>
                        <td>Thornton</td>
                        <td>@fat</td>
                    </tr>
                    <tr>
                        <th scope="row">3</th>
                        <td>John</td>
                        <td>Doe</td>
                        <td>@social</td>
                    </tr>
                </tbody>
                </table>
            </div>
        </div>
    )
}
export default T_Codification;