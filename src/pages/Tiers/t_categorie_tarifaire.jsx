const T_Categorie_tarifaire = () => {
    return (
        <div className="card mb-4 shadow-sm">
            <div className="card-header bg-light fw-semibold">
                Catégorie tarifaire
                <h5><b>Ajouter un nouvel élément</b></h5>
            </div>
            <div className="card-body">
                <ul class="list-group">
                    <li class="list-group-item">An item</li>
                    <li class="list-group-item">A second item</li>
                    <li class="list-group-item">A third item</li>
                    <li class="list-group-item">A fourth item</li>
                    <li class="list-group-item">And a fifth one</li>
                </ul>
            </div>
            <div className="card-footer">
                <div className="row">
                    <div className="col-2">
                        <label htmlFor="intitule">Initulé</label>
                    </div>
                    <div className="col-8">
                        <input type="text" name="" id="intitule" className="form-control" />
                    </div>
                    <div className="col-2">
                        <button className="btn btn-outline-primary">Enregistrer</button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-2">
                        <label htmlFor="tarif">Tarif par défaut</label>
                    </div>
                    <div className="col-8">
                        <input type="text" name="" id="tarif" className="form-control" disabled/>
                    </div>
                    <div className="col-2">
                        <button className="btn btn-outline-secondary">
                            Supprimer
                        </button>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}
export default T_Categorie_tarifaire;