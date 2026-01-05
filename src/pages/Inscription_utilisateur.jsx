import React, { useState } from "react";

// Exemple de roles et entreprises
const roles = [
  { id: 2, name: "Commercial" },
  { id: 3, name: "Comptable" },
];

const entreprises = [
  { id: 1, name: "BOSS CAR SERVICE" },
  { id: 2, name: "Tech Solutions" },
  { id: 3, name: "My Startup" },
];

const UserSignupForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    role: "",
    entreprise_id: "",
  });

  // Gestion des changements de formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Soumettre le formulaire
  const handleSubmit = (e) => {
    e.preventDefault();

    // Vérification simple
    if (
      !formData.email ||
      !formData.username ||
      !formData.password ||
      !formData.role ||
      !formData.entreprise_id
    ) {
      alert("Veuillez remplir tous les champs !");
      return;
    }

    // Payload final
    console.log("Payload :", {
      ...formData,
      role: Number(formData.role),
      entreprise_id: Number(formData.entreprise_id),
    });

    alert("Utilisateur inscrit ! Voir console pour le payload.");
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="card-title mb-4">Inscription Utilisateur</h2>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@gmail.com"
                required
              />
            </div>

            {/* Username */}
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="form-control"
                value={formData.username}
                onChange={handleChange}
                placeholder="Antonio Rbm 5"
                required
              />
            </div>

            {/* Password */}
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                placeholder="azerty1234"
                required
              />
            </div>

            {/* Role */}
            <div className="mb-3">
              <label htmlFor="role" className="form-label">
                Rôle
              </label>
              <select
                id="role"
                name="role"
                className="form-select"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="">-- Sélectionnez un rôle --</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Entreprise */}
            <div className="mb-3">
              <label htmlFor="entreprise_id" className="form-label">
                Entreprise
              </label>
              <select
                id="entreprise_id"
                name="entreprise_id"
                className="form-select"
                value={formData.entreprise_id}
                onChange={handleChange}
                required
              >
                <option value="">-- Sélectionnez une entreprise --</option>
                {entreprises.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Bouton Submit */}
            <button type="submit" className="btn btn-success">
              S'inscrire
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserSignupForm;
