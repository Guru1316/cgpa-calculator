// src/App.jsx
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const gradePoints = {
    O: 10,
    "A+": 9,
    A: 8,
    "B+": 7,
    B: 6,
    C: 5,
    F: 0,
  };

  const [prevCgpa, setPrevCgpa] = useState("");
  const [prevCredits, setPrevCredits] = useState("");
  const [numSubjects, setNumSubjects] = useState(5);
  const [subjects, setSubjects] = useState(
    Array(5).fill({ grade: "O", credit: "" })
  );
  const [sgpa, setSgpa] = useState(null);
  const [cgpa, setCgpa] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const handleNumSubjectsChange = (e) => {
    const n = parseInt(e.target.value) || 0;
    setNumSubjects(n);
    setSubjects(Array(n).fill({ grade: "O", credit: "" }));
  };

  const handleSubjectChange = (index, field, value) => {
    const updated = [...subjects];
    updated[index] = { ...updated[index], [field]: value };
    setSubjects(updated);
  };

  const calculateCgpa = () => {
    // Current semester calculations (SGPA)
    let semCredits = 0;
    let semPoints = 0;

    subjects.forEach((sub) => {
      const credit = parseFloat(sub.credit) || 0;
      const gradePoint = gradePoints[sub.grade] || 0;
      semCredits += credit;
      semPoints += gradePoint * credit;
    });

    const newSgpa = semCredits > 0 ? (semPoints / semCredits).toFixed(2) : "0.00";

    // Overall CGPA calculation
    let totalCredits = (parseFloat(prevCredits) || 0) + semCredits;
    let totalPoints =
      (parseFloat(prevCgpa) || 0) * (parseFloat(prevCredits) || 0) + semPoints;

    const newCgpa =
      totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";

    setSgpa(newSgpa);
    setCgpa(newCgpa);
  };

  return (
    <div
      className={
        darkMode
          ? "bg-dark text-light min-vh-100"
          : "bg-light text-dark min-vh-100"
      }
      style={{
        transition: "all 0.3s ease-in-out",
        background: darkMode
          ? "linear-gradient(135deg, #121212, #1f1f1f)"
          : "linear-gradient(135deg, #f8f9fa, #e9ecef)",
      }}
    >
      <div className="container py-5">
        {/* Header with Dark Mode Toggle */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <h1
            className={`fw-bold ${darkMode ? "text-info" : "text-primary"}`}
          >
            🎓 CGPA & SGPA Calculator
          </h1>
          <button
            className={`btn btn-sm rounded-pill shadow-sm ${
              darkMode ? "btn-outline-light" : "btn-outline-dark"
            }`}
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        {/* Previous Details */}
        <div className="row g-4 mb-4">
          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold">Previous CGPA</label>
            <input
              type="number"
              className={`form-control shadow-sm rounded-3 ${
                darkMode ? "bg-secondary text-light border-0" : ""
              }`}
              value={prevCgpa}
              onChange={(e) => setPrevCgpa(e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold">Previous Credits</label>
            <input
              type="number"
              className={`form-control shadow-sm rounded-3 ${
                darkMode ? "bg-secondary text-light border-0" : ""
              }`}
              value={prevCredits}
              onChange={(e) => setPrevCredits(e.target.value)}
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Number of Subjects */}
        <div className="mb-4">
          <label className="form-label fw-semibold">Number of Subjects</label>
          <input
            type="number"
            className={`form-control shadow-sm rounded-3 ${
              darkMode ? "bg-secondary text-light border-0" : ""
            }`}
            min="1"
            value={numSubjects}
            onChange={handleNumSubjectsChange}
          />
        </div>

        {/* Subjects Table */}
        <div className="table-responsive mb-5 shadow-sm rounded-3 overflow-hidden">
          <table
            className={`table table-bordered table-hover align-middle mb-0 ${
              darkMode ? "table-dark table-striped" : "table-light"
            }`}
          >
            <thead
              className={`text-center ${
                darkMode ? "bg-info text-dark" : "table-primary"
              }`}
            >
              <tr>
                <th>Subject</th>
                <th>Grade</th>
                <th>Credit</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((sub, index) => (
                <tr key={index}>
                  <td className="text-center fw-semibold">{index + 1}</td>
                  <td>
                    <select
                      className={`form-select shadow-sm rounded-3 ${
                        darkMode ? "bg-secondary text-light border-0" : ""
                      }`}
                      value={sub.grade}
                      onChange={(e) =>
                        handleSubjectChange(index, "grade", e.target.value)
                      }
                    >
                      {Object.keys(gradePoints).map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      className={`form-control shadow-sm rounded-3 ${
                        darkMode ? "bg-secondary text-light border-0" : ""
                      }`}
                      value={sub.credit}
                      onChange={(e) =>
                        handleSubjectChange(index, "credit", e.target.value)
                      }
                      placeholder="0.00"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calculate Button */}
        <div className="text-center">
          <button
            className="btn btn-lg btn-success px-5 py-2 shadow-lg rounded-pill"
            onClick={calculateCgpa}
          >
            Calculate
          </button>
        </div>

        {/* Results */}
        {(sgpa || cgpa) && (
          <div
            className={`mt-5 p-4 rounded-3 text-center fw-bold fs-4 shadow-lg ${
              darkMode
                ? "bg-dark text-light border border-info"
                : "bg-white text-dark border border-primary"
            }`}
          >
            <div className="mb-3">
              🎯 <span className="text-warning">Your SGPA:</span>{" "}
              <span className="text-success display-6">{sgpa}</span>
            </div>
            <div>
              🏆 <span className="text-primary">Your CGPA:</span>{" "}
              <span className="text-success display-6">{cgpa}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
