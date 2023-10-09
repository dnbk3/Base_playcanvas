import { DataLocal } from "./dataLocal";

export class UserData{
  static init() {
    this.startNumber = DataLocal.startNumber;
    this.currentLevel = DataLocal.currentLevel;
    this.income = DataLocal.userIncomeValue;
    this.currency = DataLocal.currency;
  }
}