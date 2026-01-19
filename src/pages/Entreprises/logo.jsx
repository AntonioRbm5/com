import { useState } from "react";
import { FaImage, FaTimes, FaUpload } from "react-icons/fa";

const LogoEtp = () => {
    const [logo, setLogo] = useState(null);


    const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setLogo(URL.createObjectURL(file));
    };


    const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
    };


    return (
    <div className="card shadow-sm rounded-4 mx-auto" style={{ maxWidth: 1200 }}>
        <div className="card-body">
            <h5 className="card-title mb-3">Logo de l’entreprise</h5>


            <div
            className="border border-2 border-dashed rounded-4 p-4 text-center bg-light d-flex justify-content-center align-items-center"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            style={{ cursor: "pointer" , height: "60vh"}}
            >
            {logo ? (
            <div className="position-relative">
                <img
                src={logo}
                alt="Logo"
                className="img-fluid mx-auto d-block"
                style={{ maxHeight: 160 }}
                />
                <button
                type="button"
                className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                onClick={() => setLogo(null)}
                >
                    <FaTimes />
                </button>
            </div>
            ) : (
            <label className="d-flex flex-column align-items-center gap-2">
                <FaUpload size={32} className="text-secondary" />
                <span className="text-muted small">
                    Glissez-déposez le logo ici<br />ou cliquez pour importer
                </span>
                <input
                    type="file"
                    accept="image/*"
                    className="d-none"
                    onChange={(e) => handleFile(e.target.files[0])}
                />
            </label>
            )}
            </div>


            <div className="text-muted small mt-3 d-flex align-items-center gap-2">
                <FaImage /> Formats acceptés : PNG, JPG, SVG
            </div>
        </div>
    </div>
    );
}
export default LogoEtp;