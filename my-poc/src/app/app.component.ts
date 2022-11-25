import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { CustomerService } from "./api/api";
import { customer } from "./types/types";
import { locationAbb } from "../constants";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  displayRowData: boolean = false;
  customers: customer[];
  location: Record<string, string> = locationAbb;
  error: string;
  displayModal: boolean = false;
  customerData: Record<string, any> = {
    name: "",
    location: "",
    id: 0,
  };

  constructor(
    private httpService: CustomerService,
    public translate: TranslateService
  ) {
    translate.addLangs(["en"]);
    translate.setDefaultLang("en");

    const browserLang = translate.getBrowserLang();
    const pattern = /en/;
    translate.use(browserLang.match(pattern) ? browserLang : "en");
  }

  ngOnInit() {
    this.httpService.getCustomerData().subscribe(
      (res) => {
        this.customers = this.updateCustomers(res);
        this.httpService.postSingleCustomer(res[0]).subscribe(
          () => {
            console.log("Posted !!");
          },
          (error) => {
            this.error = error.statusText;
            this.displayModal = true;
            setTimeout(() => {
              this.displayModal = false;
            }, 5000);
          }
        );
      },
      (error) => {
        this.error = error.statusText;
        this.displayModal = true;
        setTimeout(() => {
          this.displayModal = false;
        }, 5000);
      }
    );
  }

  updateCustomers(customers) {
    return customers.map(({ name, ...rest }) => {
      const [firstName, lastName] = name.split(" ");
      const province = this.location[rest.location];
      return { ...rest, firstName, lastName, province: province || "" };
    });
  }

  hideModalWrapper() {
    this.displayRowData = false;
  }

  closeModalData() {
    this.displayModal = false;
  }

  openModal(customer: customer) {
    this.displayRowData = customer.active;
    this.customerData.name = customer.firstName + " " + customer.lastName;
    this.customerData.location = customer.province;
    this.customerData.id = customer.id;
  }
}
