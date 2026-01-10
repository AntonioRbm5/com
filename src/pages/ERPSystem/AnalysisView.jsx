const AnalysisView = ({ data }) => {
    const total = {
        nbDoc: 3,
        caHT: '42 589 110',
        marge: '7 428 510',
        margePct: '17,44'
    };

    return (
        <div style={{ padding: '16px', background: 'white', flex: 1 }}>
            <div className="document-preview">
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>
                        Analyse rentabilité clients
                    </h2>
                    <div style={{ fontSize: '10px', marginTop: '8px' }}>
                        <strong>Période du</strong> 01/01/22
                        <br />
                        <strong>au</strong> 31/12/22
                        <br />
                        <strong>Tenue de compte :</strong> FCFA
                    </div>
                </div>

                <table className="preview-table">
                    <thead>
                        <tr>
                            <th>Numéro de client</th>
                            <th>Intitulé du client</th>
                            <th style={{ textAlign: 'center' }}>Nb doc.</th>
                            <th style={{ textAlign: 'right' }}>CA HT net</th>
                            <th style={{ textAlign: 'right' }}>Marge</th>
                            <th style={{ textAlign: 'right' }}>% marge sur CA net</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                <td>{item.clientNo}</td>
                                <td>{item.clientName}</td>
                                <td style={{ textAlign: 'center' }}>{item.nbDoc}</td>
                                <td style={{ textAlign: 'right' }}>{item.caHT}</td>
                                <td style={{ textAlign: 'right' }}>{item.marge}</td>
                                <td style={{ textAlign: 'right' }}>{item.margePct}</td>
                            </tr>
                        ))}
                        <tr style={{ fontWeight: 'bold', background: '#f0f0f0' }}>
                            <td colSpan="2">Total général</td>
                            <td style={{ textAlign: 'center' }}>{total.nbDoc}</td>
                            <td style={{ textAlign: 'right' }}>{total.caHT}</td>
                            <td style={{ textAlign: 'right' }}>{total.marge}</td>
                            <td style={{ textAlign: 'right' }}>{total.margePct}</td>
                        </tr>
                    </tbody>
                </table>

                <div className="preview-footer">
                    <p>© Sage - Sage 100 Gestion commerciale Premium 8.00</p>
                    <p>Date de tirage 07/07/22 à 15:11:13 - Page : 1</p>
                </div>
            </div>
        </div>
    );
};

export default AnalysisView;