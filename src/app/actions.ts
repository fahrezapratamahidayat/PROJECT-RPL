'use server'

import axios from "axios"

export const getUserData = async (email: string) => {
    try {
      const snapshot = await axios.get(`http://localhost:3000/api/userdata?email=${email}`)
      return snapshot;
    } catch (err) {
      console.error("Error fetching user data", err);
      return null;
    }
  }