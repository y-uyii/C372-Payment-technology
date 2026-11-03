const groomingfee = 50;
const numberOfPets = 2;
const gstRate =0.09;

const subtotal = groomingfee * numberOfPets;
const gst = subtotal * gstRate;
const total = subtotal + gst;

const message ='The total cost is $' +total;

console.log(message);
