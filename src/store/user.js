import { defineStore } from "pinia";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    name: "",
    role: "",
    roleOption: [
      {
        value: "Administrator",
        label: "Administrator",
      },
      {
        value: "HR-Specialist",
        label: "HR-Specialist",
      },
      {
        value: "HR-Manager",
        label: "HR-Manager",
      },
      {
        value: "Salary-Specialist",
        label: "Salary-Specialist",
      },
      {
        value: "Salary-Manager",
        label: "Salary-Manager",
      }
    ]
  }),
  actions: {
    setUserInfo(userInfo) {
      this.username = userInfo.name;
      this.role = userInfo.role;
    },
    clearUserInfo() {
      this.name = "";
      this.role = "";
    },
  },
});
