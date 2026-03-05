import React, { useEffect, useState } from 'react';
import './style.css';

// --- EBEVEYN BİLEŞEN ---
export default function StudentPanel() {
  // Kritik İster: State (Öğrenci dizisi) ebeveynde tutuluyor!
  const [students, setStudents] = useState([]);

  // LocalStorage'dan yükle
  useEffect(() => {
    try {
      const raw = localStorage.getItem('students');
      if (raw) setStudents(JSON.parse(raw));
    } catch (e) {
      // JSON parse hatası olursa sessizce yoksay
      // (isteğe bağlı: burada bir log tutulabilir)
    }
  }, []);

  // students değiştiğinde kaydet
  useEffect(() => {
    try {
      localStorage.setItem('students', JSON.stringify(students));
    } catch (e) {
      // LocalStorage yazma hatası (ör. quota) sessizce yoksay
    }
  }, [students]);

  // Öğrenci ekleme fonksiyonu (Form'a prop olarak gidecek)
  const addStudent = (student) => {
    // Benzersiz bir id atayarak listeye ekliyoruz
    setStudents([...students, { ...student, id: Date.now() }]);
  };

  // Öğrenci silme fonksiyonu (Listeye prop olarak gidecek)
  const deleteStudent = (id) => {
    // Basit onay diyalogu (isteğe bağlı olarak yerine modal konulabilir)
    const ok = window.confirm('Öğrenciyi silmek istediğinize emin misiniz?');
    if (!ok) return;
    setStudents(students.filter(student => student.id !== id));
  };

  return (
    <div className="panel-container">
      <StudentForm onAdd={addStudent} />
      <StudentList students={students} onDelete={deleteStudent} />
    </div>
  );
}

// --- SOL TARAF: FORM BİLEŞENİ ---
function StudentForm({ onAdd }) {
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedDepartment = department.trim();
    if (!trimmedName || !trimmedDepartment) return; // Boş gönderimi engelle

    onAdd({ name: trimmedName, department: trimmedDepartment }); // Ebeveyndeki fonksiyonu tetikle
    
    // Formu temizle
    setName('');
    setDepartment('');
  };

  return (
    <div className="form-section card">
      <h2>🌸 Yeni Öğrenci Kaydı</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="student-name">İsim Soyisim</label>
          <input
            id="student-name"
            type="text"
            placeholder="Örn: Yağmur..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="student-dept">Bölüm</label>
          <input
            id="student-dept"
            type="text"
            placeholder="Örn: Yazılım Geliştirme..."
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-add">Listeye Ekle</button>
      </form>
    </div>
  );
}

// --- SAĞ TARAF: LİSTE BİLEŞENİ ---
function StudentList({ students, onDelete }) {
  return (
    <div className="list-section card">
      <h2>🎀 Kayıtlı Öğrenciler</h2>
      {students.length === 0 ? (
        <p className="empty-message">Henüz hiç öğrenci eklenmedi.</p>
      ) : (
        <table className="student-table">
          <thead>
            <tr>
              <th>İsim</th>
              <th>Bölüm</th>
              <th>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.department}</td>
                <td>
                  <button 
                    className="btn-delete" 
                    onClick={() => onDelete(student.id)}
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}