import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { CredentialPayload, DashboardSummary, Enrollment, MicroCredential } from './models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private readonly http: HttpClient) {}

  getSummary() {
    return this.http.get<DashboardSummary>(`${environment.apiUrl}/dashboard/summary`);
  }

  getCredentials() {
    return this.http.get<MicroCredential[]>(`${environment.apiUrl}/credentials`);
  }

  createCredential(payload: CredentialPayload) {
    return this.http.post<MicroCredential>(`${environment.apiUrl}/credentials`, payload);
  }

  enroll(credentialId: number) {
    return this.http.post<Enrollment>(`${environment.apiUrl}/enrollments`, { credentialId });
  }

  getMyEnrollments() {
    return this.http.get<Enrollment[]>(`${environment.apiUrl}/enrollments/me`);
  }

  completeEnrollment(id: number) {
    return this.http.patch<Enrollment>(`${environment.apiUrl}/enrollments/${id}/complete`, {});
  }
}
