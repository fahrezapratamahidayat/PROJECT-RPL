export function greetings() {
    const jam = new Date().getHours();
    let greeting;
  
    if (jam >= 4 && jam < 10) {
      greeting = "Selamat Pagi";
    } else if (jam >= 10 && jam < 15) {
      greeting = "Selamat Siang";
    } else if (jam >= 15 && jam < 18) {
      greeting = "Selamat Sore";
    } else {
      greeting = "Selamat Malam";
    }
  
    return greeting;
  }