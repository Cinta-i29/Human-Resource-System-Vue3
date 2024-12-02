import { defineStore } from "pinia";

export const useUserStore = defineStore("userStore", {
    state: () => ({
        name: "",
        role: "",
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
