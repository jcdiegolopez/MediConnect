const API_BASE_URL = 'http://localhost:3000/api';

class ApiService {
  async request(url, options = {}) {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    // Manejo de errores
    if (!response.ok) {
      let errorMsg = 'Error en la solicitud';
      try {
        const error = await response.json();
        errorMsg = error.error || errorMsg;
      } catch {
        errorMsg = response.statusText || errorMsg;
      }
      throw new Error(errorMsg);
    }

    // Si es CSV, devolver como texto
    if (url.includes('format=csv')) {
      return response.text();
    }

    if (response.status === 204) {
      return null; // No content response
    }

    return response.json();
  }

  // Pacientes
  async getPacientes() {
    return this.request('/pacientes');
  }

  async getPacienteById(id) {
    return this.request(`/pacientes/${id}`);
  }

  async createPaciente(data) {
    return this.request('/pacientes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePaciente(id, data) {
    return this.request(`/pacientes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePaciente(id) {
    return this.request(`/pacientes/${id}`, {
      method: 'DELETE',
    });
  }

  // Citas
  async getCitas(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/citas?${params}`);
  }

  async getCitaById(id) {
    return this.request(`/citas/${id}`);
  }

  async createCita(data) {
    return this.request('/citas', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCita(id, data) {
    return this.request(`/citas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCita(id) {
    return this.request(`/citas/${id}`, {
      method: 'DELETE',
    });
  }

  // Consultas
  async getConsultas(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/consultas?${params}`);
  }

  async getConsultaById(id) {
    return this.request(`/consultas/${id}`);
  }

  async createConsulta(data) {
    return this.request('/consultas', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateConsulta(id, data) {
    return this.request(`/consultas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteConsulta(id) {
    return this.request(`/consultas/${id}`, {
      method: 'DELETE',
    });
  }

  // Reportes
  async getReportePatientsByAgeGroup(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/reportes/patients-by-age-group?${params}`);
  }

  async getReporteDoctorConsultationCounts(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/reportes/doctor-consultation-counts?${params}`);
  }

  async getReporteClinicActivity(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/reportes/clinic-activity?${params}`);
  }
}

export const apiService = new ApiService();