import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

const baseUrl = "https://ballistictest.azurewebsites.net";

@Injectable({
  providedIn: "root",
})

export class CustomerService {
  private getCustomersUrl = `${baseUrl}/api/customers`;
  private postIndividualCustomerUrl = `${baseUrl}/api/customer`;

  constructor(private httpClient: HttpClient) {}

  getCustomerData() {
    return this.httpClient.get(this.getCustomersUrl);
  }

  postSingleCustomer(payload) {
    return this.httpClient.post(
      this.postIndividualCustomerUrl,
      {
        firstcustomer: btoa(JSON.stringify(payload)),
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          "x-client-id": "12345",
        },
      }
    );
  }
}
